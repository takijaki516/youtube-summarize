import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { usersSchema } from "./auth";

export const videosSchema = pgTable("video", {
  id: serial("id").primaryKey(),
  title: text("title"),
  url: text("url"),
  summary: text("summary"),
  userId: text("userId")
    .notNull()
    .references(() => usersSchema.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type Video = typeof videosSchema.$inferSelect;
