import { NextResponse, type NextRequest } from "next/server";
import { drizzleClient, schema } from "@repo/database";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { createSummaryStream } from "@/lib/llm/stream-factory";

export const POST = async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return Response.json({ message: "인증되지 않음" }, { status: 401 });
  }

  const { videoUrl } = await req.json();
  if (!videoUrl) {
    return Response.json({ error: "올바르지 않은 URL" }, { status: 400 });
  }

  const userId = session.user.id;

  // NOTE: 10 requests per day
  const now = new Date();
  const limit = 10;

  const existingRecord = await drizzleClient
    .select()
    .from(schema.userRateLimitSchema)
    .where(eq(schema.userRateLimitSchema.userId, userId))
    .limit(1);

  if (
    existingRecord[0] &&
    existingRecord[0].count >= limit &&
    now <= existingRecord[0].resetAt
  ) {
    return NextResponse.json({ message: "한도 초과" }, { status: 429 });
  }

  // NOTE: auth, rate limit, body validation 통과
  return createSummaryStream(videoUrl, {
    userId: userId,
  });
};
