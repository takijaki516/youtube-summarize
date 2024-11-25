import { dbDrizzle, rateLimitsSchema } from "@repo/database";
import { gt, sql } from "drizzle-orm";

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

    // Try to update existing rate limit
    const [updated] = await dbDrizzle
      .insert(rateLimitsSchema)
      .values({
        key,
        count: 1,
        resetAt,
      })
      .onConflictDoUpdate({
        target: rateLimitsSchema.key,
        where: gt(rateLimitsSchema.resetAt, now),
        set: {
          count: sql`${rateLimitsSchema.count} + 1`,
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
