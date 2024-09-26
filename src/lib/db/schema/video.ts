import { pgTable, serial, text } from "drizzle-orm/pg-core";

import { users } from "./auth";

export const videos = pgTable("video", {
  id: serial("id").primaryKey(),
  title: text("title"),
  url: text("url"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
