import { NextFunction, Request, Response } from "express";
import z from "zod";
import { ApplicationError } from "../utils/error";

export const validateBody = (schema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { success, error, data } = schema.safeParse(req.body);
    if (error) {
      next(new ApplicationError(error.message, 400));
    }
    req.body = data;
    next();
  };
};
