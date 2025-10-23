import { JwtPayload } from "./jwt";

declare global {
  namespace Express {
    export interface Locals {
      payload?: JwtPayload;
    }
  }
}
