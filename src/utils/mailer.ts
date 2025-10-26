import { Resend } from "resend";
import { env } from "./env";

export const mailer = new Resend(env.RESEND_API_KEY);
