import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const rateLimitsSchema = pgTable("rateLimits", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull().default(0),
  resetAt: timestamp("reset_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});