import { drizzleClient, schema } from "@repo/database";
import { and, desc, eq, sql } from "drizzle-orm";

import { auth } from "@/lib/auth";

export const GET = async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ message: "인증되지 않음" }, { status: 401 });
  }

  const userId = session.user.id;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");
  const search = searchParams.get("search") ?? "";
  const offset = (page - 1) * limit;

  const videos = await drizzleClient
    .select()
    .from(schema.videosSchema)
    .where(
      and(
        sql`title ILIKE ${`%${search}%`}`,
        eq(schema.videosSchema.userId, userId),
      ),
    )
    .limit(limit)
    .offset(offset)
    .orderBy(desc(schema.videosSchema.updatedAt));

  const totalCount = await drizzleClient
    .select({ count: sql`count(*)` })
    .from(schema.videosSchema)
    .where(
      and(
        sql`title ILIKE ${`%${search}%`}`,
        eq(schema.videosSchema.userId, userId),
      ),
    )
    .then((res) => Number(res[0]?.count));

  return Response.json({
    videos,
    nextPage: offset + limit < totalCount ? page + 1 : null,
    totalCount,
  });
};

export const DELETE = async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ message: "인증되지 않음" }, { status: 401 });
  }

  const { id } = await request.json();

  await drizzleClient
    .delete(schema.videosSchema)
    .where(
      and(
        eq(schema.videosSchema.id, +id),
        eq(schema.videosSchema.userId, session.user.id),
      ),
    );

  return Response.json(
    { message: "Video deleted successfully" },
    { status: 200 },
  );
};
