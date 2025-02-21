import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const tempVideosSchema = pgTable("tempVideo", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),

  originalTranscriptLanguage: text("originalTranscriptLanguage").notNull(),

  rawSummary: text("raw_summary"),
  summary: text("summary"),
  // korean
  translatedSummary: text("translatedSummary"),

  clientUUID: text("clientUUID").notNull(),
  videoId: text("videoId").notNull(),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type TempVideo = typeof tempVideosSchema.$inferSelect;
