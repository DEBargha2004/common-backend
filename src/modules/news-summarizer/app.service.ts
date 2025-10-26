import { and, desc, eq } from "drizzle-orm";
import { db } from "../../db/client";
import {
  executions,
  flows,
  TDBExecutionInsert,
  TDBFlow,
} from "../../db/schema";
import { TFlowSchema } from "../../schema/flow.schema";
import { TFlowBrief } from "../../types/flow";
import { UpdateProps } from "../../types";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../../utils/env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../../utils/aws";

export class NewsAppService {
  static async getAllWorkflowsOfUser(userId: string): Promise<TFlowBrief[]> {
    const res = await db.select().from(flows).where(eq(flows.userId, userId));
    return res;
  }

  static async createFlow(data: TFlowSchema, userId: string) {
    const res = await db
      .insert(flows)
      .values({
        title: data.title,
        prompt: data.prompt,
        userId,
      })
      .returning();

    return res[0];
  }

  static async getFlow(id: number) {
    const res = await db.select().from(flows).where(eq(flows.id, id));
    return res[0];
  }

  static async updateFlow(id: number, data: UpdateProps<TDBFlow, "id">) {
    const res = await db.update(flows).set(data).where(eq(flows.id, id));
    return res;
  }

  static async createNewExecution(data: TDBExecutionInsert) {
    await db.insert(executions).values(data);
  }

  static async getAllWorkflows() {
    return await db.select({ id: flows.id }).from(flows);
  }

  static async getWorkflowExecutions(workflowId: number) {
    return await db
      .select()
      .from(executions)
      .where(eq(executions.flowId, workflowId))
      .orderBy(desc(executions.createdAt));
  }

  static async getExecution(executionId: number, userId: string) {
    const res = await db
      .select({
        id: executions.id,
        contentPath: executions.contentPath,
        flowId: executions.flowId,
      })
      .from(executions)
      .leftJoin(
        flows,
        and(eq(flows.id, executions.flowId), eq(flows.userId, userId))
      )
      .where(eq(executions.id, executionId));

    return res[0];
  }

  static async getNewsTemplateUrl(executionId: string, userId: string) {
    const execution = await NewsAppService.getExecution(
      Number(executionId),
      userId
    );

    if (!execution) throw new Error("No execution found");

    const command = new GetObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: execution.contentPath ?? "",
    });

    const url = await getSignedUrl(s3, command);

    return url;
  }
}
