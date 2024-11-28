import { desc, eq, sql } from "drizzle-orm";

import { dbDrizzle, videosSchema } from "@repo/database";
import { auth } from "@/auth";

export const GET = auth(async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");
  const search = searchParams.get("search") ?? "";
  const offset = (page - 1) * limit;

  const videos = await dbDrizzle
    .select()
    .from(videosSchema)
    .where(sql`title ILIKE ${`%${search}%`}`)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(videosSchema.updatedAt));

  const totalCount = await dbDrizzle
    .select({ count: sql`count(*)` })
    .from(videosSchema)
    .where(sql`title ILIKE ${`%${search}%`}`)
    .then((res) => Number(res[0]?.count));

  return Response.json({
    videos,
    nextPage: offset + limit < totalCount ? page + 1 : null,
    totalCount,
  });
});

export const DELETE = auth(async function DELETE(request: Request) {
  const { id } = await request.json();

  await dbDrizzle.delete(videosSchema).where(eq(videosSchema.id, +id));

  return Response.json({ message: "Video deleted successfully" });
});
