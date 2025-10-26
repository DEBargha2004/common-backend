import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import { ApplicationError } from "../../utils/error";
import { catchError } from "../../utils/catch-error";
import { DrizzleQueryError } from "drizzle-orm";

export class UserController {
  static async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    const payload = res.locals.payload;

    if (!payload) return next(new ApplicationError("User not logged in"));

    const [err, user] = await catchError(UserService.getUserById(payload.sub));

    if (err) {
      return next(new ApplicationError("Internal Server Error"));
    } else
      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
  }
}
