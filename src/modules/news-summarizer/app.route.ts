import { Router } from "express";

const newsAppRouter = Router();

newsAppRouter.get("/all");
newsAppRouter.post("/new");

export { newsAppRouter };
