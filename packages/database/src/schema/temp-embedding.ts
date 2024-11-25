import {
  vector,
  pgTable,
  text,
  integer,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";

import { tempVideosSchema } from "./temp-video";

export const tempEmbeddingsSchema = pgTable("tempEmbedding", {
  id: serial("id").primaryKey(),
  embedding: vector("embedding", { dimensions: 1536 }),
  text: text("text"),
  lang: text("lang"),
  start: integer("start"),

  videoId: integer("videoId")
    .notNull()
    .references(() => tempVideosSchema.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type TempEmbedding = typeof tempEmbeddingsSchema.$inferSelect;
