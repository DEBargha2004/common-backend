import { GoogleGenAI } from "@google/genai";
import { env } from "./env";
import { promptTemplate } from "../constants/template";

export const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

export type AIIntent = "preprocess-query" | "extract-content";

export const generateContent = (prompt: string, intent: AIIntent) => {
  return ai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: promptTemplate[intent](prompt),
  });
};
