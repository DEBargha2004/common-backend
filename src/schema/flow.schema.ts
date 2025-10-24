import { z } from "zod";

export const flowSchema = z.object({
  title: z.string().min(3),
  prompt: z.string().min(10),
});

export type TFlowSchema = z.infer<typeof flowSchema>;
