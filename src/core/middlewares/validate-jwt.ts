import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../modules/auth/auth.service";
import { ApplicationError } from "../utils/error";

export const validateJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const data = AuthService.verifyAccessToken(token ?? "");
    res.locals.payload = data;
    next();
  } catch (error) {
    return next(
      new ApplicationError("Token Expired", 500, {
        token: { expired: true },
      })
    );
  }
};
