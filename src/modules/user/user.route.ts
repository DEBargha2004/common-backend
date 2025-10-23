import { Router } from "express";
import { UserController } from "./user.controller";
import { validateJwt } from "../../core/middlewares/validate-jwt";

const userRouter = Router();

userRouter.get("/current", validateJwt, UserController.getCurrentUser);

export { userRouter };
