import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { usersSchema } from "./auth";

export const videosSchema = pgTable("video", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  summary: text("summary").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => usersSchema.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type Video = typeof videosSchema.$inferSelect;
