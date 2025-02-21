import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";

export const videosSchema = pgTable("video", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title").notNull(),

  originalTranscriptLanguage: text("originalTranscriptLanguage").notNull(),

  rawSummary: text("raw_summary"),
  summary: text("summary"),
  // korean
  translatedSummary: text("translatedSummary"),

  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  videoId: text("videoId").notNull(),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type Video = typeof videosSchema.$inferSelect;
