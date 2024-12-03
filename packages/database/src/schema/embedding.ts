import {
  vector,
  pgTable,
  text,
  integer,
  serial,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { videosSchema } from "./video";

export const embeddingsSchema = pgTable("embedding", {
  id: serial("id").primaryKey(),
  embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  text: text("text").notNull(),
  // NOTE:
  lang: text("lang").notNull(),
  start: integer("start").notNull(),
  videoId: uuid("videoId")
    .notNull()
    .references(() => videosSchema.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
