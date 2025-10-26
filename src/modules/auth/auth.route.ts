import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateBody } from "../../middlewares/validate-body";
import { registerSchema } from "../../schema/register.schema";
import { loginSchema } from "../../schema/login.schema";

const authRouter = Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  AuthController.register
);
authRouter.post("/login", validateBody(loginSchema), AuthController.login);
authRouter.post("/logout", AuthController.logout);

export default authRouter;
