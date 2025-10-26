import "dotenv/config";

import z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  GEMINI_API_KEY: z.string(),
  TAVILY_API_KEY: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_S3_BUCKET_NAME: z.string(),
  RESEND_API_KEY: z.string(),
  APP_MAIL_ID: z.string(),
});

export const env = envSchema.parse(process.env);
