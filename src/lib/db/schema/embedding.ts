import { vector, pgTable, text, integer, serial } from "drizzle-orm/pg-core";

import { users } from "./auth";
import { videos } from "./video";

export const embeddings = pgTable("embedding", {
  id: serial("id").primaryKey(),
  embedding: vector("embedding", { dimensions: 1536 }),
  text: text("text"),
  lang: text("lang"),
  start: integer("start"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  videoId: integer("videoId")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
});
