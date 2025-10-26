import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import authRouter from "./modules/auth/auth.route";
import { env } from "./utils/env";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./modules/user/user.route";
import { SuccessResponse } from "./utils/response";
import morgan from "morgan";
import { newsAppRouter } from "./modules/news-summarizer/app.route";
import { serve } from "inngest/express";
import { inngest, inngestFunctions } from "./inngest";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/news-app", newsAppRouter);
app.use(
  "/api/v1/inngest",
  serve({ client: inngest, functions: inngestFunctions })
);

app.get("/health", (req, res) => {
  res.status(200).json(new SuccessResponse("System is up and runnning"));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const data = err.data;

  res.status(statusCode).json({
    statusCode,
    message,
    data,
  });
});

app.listen(env.PORT, () => {
  console.log(`Backend running at PORT ${env.PORT}`);
});
