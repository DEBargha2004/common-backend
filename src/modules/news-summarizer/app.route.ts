import { Router } from "express";
import { validateJwt } from "../../middlewares/validate-jwt";
import { validateBody } from "../../middlewares/validate-body";
import { flowSchema } from "../../schema/flow.schema";
import { NewsAppController } from "./app.controller";
import { inngest } from "../../inngest";
import { events } from "../../inngest/events";

const newsAppRouter = Router();

newsAppRouter.post("/workflow/execute", async (req, res) => {
  const workflowId = req.body.workflowId;

  await inngest.send({
    name: events.createNews,
    data: {
      workflowId,
    },
  });

  res.json({ status: "true" });
});

newsAppRouter.use(validateJwt);

newsAppRouter.get("/all", NewsAppController.getAllUserFlows);
newsAppRouter.post(
  "/new",
  validateBody(flowSchema),
  NewsAppController.createNewFlow
);

newsAppRouter.get("/workflow/:id", NewsAppController.getWorkflow);
newsAppRouter.get(
  "/workflow/:id/executions",
  NewsAppController.getWorkflowExecutions
);
newsAppRouter.get(
  "/execution/:id/template-url",
  NewsAppController.getTemplateUrl
);

export { newsAppRouter };
