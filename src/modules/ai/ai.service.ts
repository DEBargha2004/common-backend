import { ai, AIIntent } from "../../utils/ai";
import { promptTemplate } from "../../constants/template";
import { webClient } from "../../utils/web-client";

export class AIService {
  static async generateContent(prompt: string, intent: AIIntent) {
    return ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: promptTemplate[intent](prompt),
    });
  }

  static async queryWeb(query: string) {
    const res = await webClient.search(query);
    return res;
  }
}
