import { Request } from "express";
import { JwtPayload } from "./jwt";

export type PRequest = Request & { payload: JwtPayload };
