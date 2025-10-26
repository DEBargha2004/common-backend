import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { catchError } from "../../utils/catch-error";
import { ApplicationError } from "../../utils/error";
import { SuccessResponse } from "../../utils/response";
import { TLogin } from "../../schema/login.schema";
import { UserService } from "../user/user.service";
import bcrypt from "bcrypt";
import { DrizzleQueryError } from "drizzle-orm";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    const [err, user] = await catchError(UserService.createUser(req.body));
    if (err) {
      if (err instanceof DrizzleQueryError) {
        return next(new ApplicationError("Email already exists", 500));
      }
      return next(new ApplicationError(err.message, 500));
    }

    const accessToken = AuthService.createAccessToken({
      sub: user!.id,
      email: user!.name,
    });
    return res.status(200).json(
      new SuccessResponse("Registration Successful").include({
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
    );
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    const body = req.body as TLogin;
    const user = await UserService.getUserByEmail(body.email);
    if (!user) return next(new ApplicationError("User Not Found"));

    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) return next(new ApplicationError("User Not Found"));

    const accessToken = AuthService.createAccessToken({
      sub: user.id,
      email: user.email,
    });

    res.status(200).json(
      new SuccessResponse("Login Successful").include({
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
    );
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    res.clearCookie("access_token");
    return res.status(200).json(new SuccessResponse("Logout Successful", 200));
  }
}
