import cron from "node-cron";
import { lt } from "drizzle-orm";

import { dbDrizzle, rateLimitsSchema } from "@repo/database";

console.log("Worker started");

cron.schedule(
  "0 0 * * *",
  async () => {
    console.log("Running rate limit reset...");
    try {
      await resetRateLimits();
      console.log("Rate limits reset successfully");
    } catch (err) {
      console.error("Error resetting rate limits:", err);
    }
  },
  {
    timezone: "UTC",
  }
);

export async function resetRateLimits() {
  const now = new Date();
  await dbDrizzle
    .delete(rateLimitsSchema)
    .where(lt(rateLimitsSchema.resetAt, now));
}
