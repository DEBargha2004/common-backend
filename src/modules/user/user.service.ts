import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { users } from "../../db/schema";
import { TRegister } from "../../schema/register.schema";
import bcrypt from "bcrypt";

export class UserService {
  static async createUser(payload: TRegister) {
    const hash = await bcrypt.hash(payload.password, 10);
    const user = await db
      .insert(users)
      .values({
        name: payload.name,
        email: payload.email,
        passwordHash: hash,
      })
      .returning();
    return user[0];
  }

  static async getUserById(id: string) {
    const res = await db.select().from(users).where(eq(users.id, id));
    return res[0];
  }

  static async getUserByEmail(email: string) {
    const res = await db.select().from(users).where(eq(users.email, email));
    return res[0];
  }
}
