import { drizzleClient, schema } from "@repo/database";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

import { createSummaryStream } from "@/lib/llm/stream-factory";

export async function POST(req: Request) {
  const { videoUrl } = await req.json();
  if (!videoUrl) {
    return Response.json({ message: "올바르지 않은 URL" }, { status: 400 });
  }

  // NOTE: identifying guest users by cookie
  const cookieStore = cookies();
  let clientUUID = cookieStore.get("clientUUID")?.value;

  if (!clientUUID) {
    clientUUID = uuidv4();

    cookieStore.set("clientUUID", clientUUID, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  // NOTE: 3 requests per day per clientUUID
  const now = new Date();
  const limit = 3;

  const existingRecord = await drizzleClient
    .select()
    .from(schema.rateLimitsSchema)
    .where(eq(schema.rateLimitsSchema.clientUUID, clientUUID))
    .limit(1);

  // 한도 초과
  if (
    existingRecord[0] &&
    existingRecord[0].count >= limit &&
    existingRecord[0].resetAt >= now
  ) {
    return Response.json({ message: "한도초과" }, { status: 429 });
  }

  return createSummaryStream(videoUrl, {
    clientUUID,
    isGuest: true,
  });
}
