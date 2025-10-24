import { NextFunction, Request, Response } from "express";
import { catchError } from "../../core/utils/catch-error";
import { NewsAppService } from "./app.service";
import { JwtPayload } from "../../types/jwt";
import { TFlowSchema } from "../../schema/flow.schema";
import { ApplicationError } from "../../core/utils/error";
import { SuccessResponse } from "../../core/utils/response";
import { TFlowSmall } from "../../types/flow";

export class NewsAppController {
  static async getAllUserFlows(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const payload = res.locals.payload as JwtPayload;
    const [err, flows] = await catchError(
      NewsAppService.getAllWorkflows(payload.sub)
    );

    if (err) {
      return next(new ApplicationError("Could not get workflows"));
    }
    return res
      .status(200)
      .json(
        new SuccessResponse<TFlowSmall[]>(
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
      new SuccessResponse<TFlowSmall>("Flow created successfully", 201).include(
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
  }
}
