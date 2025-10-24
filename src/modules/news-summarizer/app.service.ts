import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { executions, flows } from "../../db/schema";
import { TFlowSchema } from "../../schema/flow.schema";
import { TFlowSmall } from "../../types/flow";

export class NewsAppService {
  static async getAllWorkflows(userId: string): Promise<TFlowSmall[]> {
    const res = await db.select().from(flows).where(eq(flows.userId, userId));
    return res;
  }

  static async createFlow(e: TFlowSchema, userId: string) {
    const res = await db
      .insert(flows)
      .values({
        title: e.title,
        prompt: e.prompt,
        userId,
      })
      .returning();

    return res[0];
  }
}
