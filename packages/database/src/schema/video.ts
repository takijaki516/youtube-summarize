import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const videosSchema = pgTable("video", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  summary: text("summary").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type Video = typeof videosSchema.$inferSelect;
