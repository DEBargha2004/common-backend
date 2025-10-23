import { NextFunction, Request, Response } from "express";

export class NewsAppController {
  static async getAllUserFlows(
    req: Request,
    res: Response,
    next: NextFunction
  ) {}

  static async createNewFlow(req: Request, res: Response, next: NextFunction) {}
}
