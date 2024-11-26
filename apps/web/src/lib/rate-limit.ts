import { dbDrizzle, rateLimitsSchema } from "@repo/database";
import { sql } from "drizzle-orm";

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}

// REVIEW:
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
) {
  try {
    const now = new Date();
    const resetAt = new Date(now.getTime() + windowMs);

    const [updated] = await dbDrizzle
      .insert(rateLimitsSchema)
      .values({
        key,
        count: 1,
        resetAt,
      })
      .onConflictDoUpdate({
        target: rateLimitsSchema.key,
        set: {
          // Reset count if window expired, otherwise increment
          count: sql`CASE 
            WHEN ${rateLimitsSchema.resetAt} <= ${now.toISOString()} THEN 1 
            ELSE ${rateLimitsSchema.count} + 1 
          END`,
          resetAt: sql`CASE 
            WHEN ${rateLimitsSchema.resetAt} <= ${now.toISOString()} THEN ${resetAt.toISOString()} 
            ELSE ${rateLimitsSchema.resetAt}
          END`,
          updatedAt: now,
        },
      })
      .returning();

    if (updated && updated.count > limit) {
      throw new RateLimitError("Rate limit exceeded");
    }
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }
    console.error("Rate limit check error:", error);
    // Don't block the request if rate limiting fails
    return;
  }
}
