import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { usersSchema } from "./auth";

// Add this new schema
export const userRateLimitsSchema = pgTable("user_rate_limits", {
  userId: text("userId")
    .primaryKey()
    .references(() => usersSchema.id, { onDelete: "cascade" }),
  requestCount: integer("request_count").notNull().default(0),
  lastReset: timestamp("last_reset").notNull().defaultNow(),
});
