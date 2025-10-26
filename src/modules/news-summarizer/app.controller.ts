import { NextFunction, Request, Response } from "express";
import { catchError } from "../../utils/catch-error";
import { NewsAppService } from "./app.service";
import { JwtPayload } from "../../types/jwt";
import { TFlowSchema } from "../../schema/flow.schema";
import { ApplicationError } from "../../utils/error";
import { SuccessResponse } from "../../utils/response";
import { TFlowBrief } from "../../types/flow";

export class NewsAppController {
  static async getAllUserFlows(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const payload = res.locals.payload as JwtPayload;
    const [err, flows] = await catchError(
      NewsAppService.getAllWorkflowsOfUser(payload.sub)
    );

    if (err) {
      return next(new ApplicationError("Could not get workflows"));
    }
    return res
      .status(200)
      .json(
        new SuccessResponse<TFlowBrief[]>(
          "Workflows fetched successfully"
        ).include(flows)
      );
  }

  static async createNewFlow(req: Request, res: Response, next: NextFunction) {
    const payload = res.locals.payload as JwtPayload;
    const body = req.body as TFlowSchema;
    const [err, flow] = await catchError(
      NewsAppService.createFlow(body, payload.sub)
    );

    if (err) {
      return next(new ApplicationError("Internal Server Error"));
    }

    return res.status(201).json(
      new SuccessResponse<TFlowBrief>("Flow created successfully", 201).include(
        {
          id: flow.id,
          title: flow.title,
          prompt: flow.prompt,
          lastExecuted: flow.lastExecuted,
          totalExecutions: flow.totalExecutions,
        }
      )
    );
  }

  static async getWorkflow(req: Request, res: Response, next: NextFunction) {
    const { sub: userId } = res.locals.payload as JwtPayload;
    const workflowId = req.params["id"];

    const [err, flow] = await catchError(
      NewsAppService.getFlow(Number(workflowId))
    );

    if (err) return next(new ApplicationError("Internal Server Error"));
    if (flow.userId !== userId)
      return next(new ApplicationError("UnAuthorized Access"));

    res.status(200).json(flow);
  }

  static async getWorkflowExecutions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const workflowId = req.params.id;
    const payload = res.locals.payload as JwtPayload;

    const workflow = await NewsAppService.getFlow(Number(workflowId));

    if (workflow.userId !== payload.sub) {
      return next(new ApplicationError("Unauthorized Access"));
    }

    const executions = await NewsAppService.getWorkflowExecutions(
      Number(workflowId)
    );
    return res.status(200).json(executions);
  }

  static async getTemplateUrl(req: Request, res: Response, next: NextFunction) {
    const payload = res.locals.payload as JwtPayload;
    const id = req.params.id;

    const url = await NewsAppService.getNewsTemplateUrl(id, payload.sub);

    res.status(200).json({ url });
  }
}
