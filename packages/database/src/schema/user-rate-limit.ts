import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";

export const userRateLimitSchema = pgTable("userRateLimit", {
  id: serial("id").primaryKey(),

  userId: text("userId")
    .unique()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  count: integer("count").notNull().default(0),
  resetAt: timestamp("reset_at").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
