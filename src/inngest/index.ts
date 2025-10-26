import { Inngest } from "inngest";
import { events } from "./events";
import { AIService } from "../modules/ai/ai.service";
import { NewsAppService } from "../modules/news-summarizer/app.service";
import { generateHTML } from "../utils/template";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { s3 } from "../utils/aws";
import { env } from "../utils/env";
import { TWebContent } from "../types/flow";
import { mailer } from "../utils/mailer";
import { UserService } from "../modules/user/user.service";

export const inngest = new Inngest({ id: "agent-flow" });

const createNews = inngest.createFunction(
  { id: "create-news" },
  { event: events.createNews },
  async ({ event, step }) => {
    const { workflowId } = event.data;
    const timestamp = new Date();

    const workflow = await step.run("get-workflow", async () => {
      return await NewsAppService.getFlow(Number(workflowId));
    });

    let preprocessedQuery = await step.run("preprocess-query", async () => {
      const res = await AIService.generateContent(
        workflow.prompt,
        "preprocess-query"
      );

      return res.text;
    });

    preprocessedQuery = preprocessedQuery?.replace(/\n/g, "") ?? "";

    const queryData = await step.run("query-web", async () => {
      return await AIService.queryWeb(preprocessedQuery ?? workflow.prompt);
    });

    const extractedData = await step.run("extract-data", async () => {
      const res = await AIService.generateContent(
        JSON.stringify(queryData.results),
        "extract-content"
      );

      let jsonText = res.text;
      if (jsonText?.startsWith("```json")) {
        const firstBracketIndex = jsonText.indexOf("[");
        const lastBracketIndex = jsonText.lastIndexOf("]");

        jsonText = jsonText.slice(firstBracketIndex, lastBracketIndex + 1);
      }

      return JSON.parse(jsonText ?? `[]`) as TWebContent[];
    });

    const html = await step.run("generate-html", () => {
      return generateHTML({
        title: preprocessedQuery,
        res: extractedData,
        timestamp,
      });
    });

    const key = await step.run("key-gen", () => {
      const randromString = crypto.randomBytes(16).toString("hex");
      const key = `contents/${randromString}.html`;
      return key;
    });

    const command = new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: "text/html",
      Body: html,
    });

    await step.run("uploading-to-s3", async () => {
      await s3.send(command);
      return key;
    });

    const mailerRes = await step.run("send-mail", async () => {
      const user = await UserService.getUserById(workflow.userId);

      return await mailer.emails.send({
        from: env.APP_MAIL_ID,
        to: user.email,
        subject:
          preprocessedQuery ?? `News Summary ${timestamp.toDateString()}`,
        html,
      });
    });

    await step.run("update-db", async () => {
      await NewsAppService.createNewExecution({
        flowId: workflow.id,
        contentPath: key,
        mailedAt: mailerRes.error ? null : timestamp,
      });

      await NewsAppService.updateFlow(workflowId, {
        totalExecutions: workflow.totalExecutions + 1,
        lastExecuted: timestamp,
      });
    });

    return preprocessedQuery;
  }
);

const prepareDailyNews = inngest.createFunction(
  { id: "prepare/daily-news" },
  { cron: "TZ=Asia/Kolkata 30 8 * * *" },
  async ({ step }) => {
    const workflows = await step.run("get-workflows", async () => {
      return await NewsAppService.getAllWorkflows();
    });

    const eventList = workflows.map((flow) => {
      return {
        name: events.createNews,
        data: { workflowId: flow.id },
      };
    });

    await step.sendEvent("send-create-news-event", eventList);
  }
);

export const inngestFunctions = [createNews, prepareDailyNews];
