import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const tempVideosSchema = pgTable("tempVideo", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  summary: text("summary").notNull(),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type TempVideo = typeof tempVideosSchema.$inferSelect;
