import {
  vector,
  pgTable,
  text,
  integer,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";

import { usersSchema } from "./auth";
import { videosSchema } from "./video";

export const embeddingsSchema = pgTable("embedding", {
  id: serial("id").primaryKey(),
  embedding: vector("embedding", { dimensions: 1536 }),
  text: text("text"),
  lang: text("lang"),
  start: integer("start"),
  userId: text("userId")
    .notNull()
    .references(() => usersSchema.id, { onDelete: "cascade" }),
  videoId: integer("videoId")
    .notNull()
    .references(() => videosSchema.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
