import jwt from "jsonwebtoken";
import { env } from "../../core/utils/env";
import { TLogin } from "../../schema/login.schema";
import { JwtPayload } from "../../types/jwt";

type RefreshTokenPayload = {
  userId: string;
  userAgent?: string;
  ipAddress?: string;
  token: string;
};

export class AuthService {
  static async login(body: TLogin, options: RefreshTokenPayload) {}

  static createAccessToken(payload: JwtPayload) {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: "7d",
    });
  }

  static verifyAccessToken(token: string) {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  }
}
