import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const flows = pgTable("flows", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  totalExecutions: integer("total_executions")
    .notNull()
    .$defaultFn(() => 0),
  lastExecuted: timestamp("last_executed"),
});

export const executions = pgTable("executions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  flowId: integer("flow_id")
    .notNull()
    .references(() => flows.id, {
      onDelete: "cascade",
    }),
  contentPath: text("content_path"),
  mailedAt: timestamp("mailed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type TDBFlow = typeof flows.$inferSelect;
export type TDBExecutionInsert = typeof executions.$inferInsert;
