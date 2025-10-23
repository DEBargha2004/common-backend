import z from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type TLogin = z.infer<typeof loginSchema>;
