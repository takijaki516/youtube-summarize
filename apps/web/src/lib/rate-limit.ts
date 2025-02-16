import { sql } from "drizzle-orm";
import { drizzleClient, schema } from "@repo/database";

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}

export async function checkRateLimit(
  clientUUID: string,
  limit: number,
  windowMs: number,
) {
  try {
    const now = new Date();
    const resetAt = new Date(now.getTime() + windowMs);

    const [updated] = await drizzleClient
      .insert(schema.rateLimitsSchema)
      .values({
        clientUUID,
        count: 1,
        resetAt,
      })
      .onConflictDoUpdate({
        target: schema.rateLimitsSchema.clientUUID,
        set: {
          //
          count: sql`CASE 
            WHEN ${schema.rateLimitsSchema.resetAt} <= ${now.toISOString()} THEN 1 
            ELSE ${schema.rateLimitsSchema.count} + 1 
          END`,
          //
          resetAt: sql`CASE 
            WHEN ${schema.rateLimitsSchema.resetAt} <= ${now.toISOString()} THEN ${resetAt.toISOString()} 
            ELSE ${schema.rateLimitsSchema.resetAt}
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

    throw error;
  }
}
