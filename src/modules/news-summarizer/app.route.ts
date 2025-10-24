import { Router } from "express";
import { validateJwt } from "../../core/middlewares/validate-jwt";
import { validateBody } from "../../core/middlewares/validate-body";
import { flowSchema } from "../../schema/flow.schema";
import { NewsAppController } from "./app.controller";

const newsAppRouter = Router();

newsAppRouter.use(validateJwt);

newsAppRouter.get("/all", NewsAppController.getAllUserFlows);
newsAppRouter.post(
  "/new",
  validateBody(flowSchema),
  NewsAppController.createNewFlow
);

newsAppRouter.get("/workflow/:id", NewsAppController.getWorkflow);

export { newsAppRouter };
