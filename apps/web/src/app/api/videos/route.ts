import { drizzleClient, schema } from "@repo/database";
import { desc, eq, sql } from "drizzle-orm";

export const GET = async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");
  const search = searchParams.get("search") ?? "";
  const offset = (page - 1) * limit;

  const videos = await drizzleClient
    .select()
    .from(schema.videosSchema)
    .where(sql`title ILIKE ${`%${search}%`}`)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(schema.videosSchema.updatedAt));

  const totalCount = await drizzleClient
    .select({ count: sql`count(*)` })
    .from(schema.videosSchema)
    .where(sql`title ILIKE ${`%${search}%`}`)
    .then((res) => Number(res[0]?.count));

  return Response.json({
    videos,
    nextPage: offset + limit < totalCount ? page + 1 : null,
    totalCount,
  });
};

export const DELETE = async function DELETE(request: Request) {
  const { id } = await request.json();

  await drizzleClient
    .delete(schema.videosSchema)
    .where(eq(schema.videosSchema.id, +id));

  return Response.json({ message: "Video deleted successfully" });
};
