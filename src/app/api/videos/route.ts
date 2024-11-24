import { desc, sql } from "drizzle-orm";

import { videosSchema } from "@/lib/db/schema/video";
import { dbDrizzle } from "@/lib/db/drizzle";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log("🚀 ~ file: route.ts:8 ~ GET ~ searchParams:", searchParams);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");
  const offset = (page - 1) * limit;

  console.log("🚀 ~ file: route.ts:11 ~ GET ~ offset:", offset);

  const videos = await dbDrizzle
    .select()
    .from(videosSchema)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(videosSchema.updatedAt));

  const totalCount = await dbDrizzle
    .select({ count: sql`count(*)` })
    .from(videosSchema)
    .then((res) => Number(res[0].count));

  return Response.json({
    videos,
    nextPage: offset + limit < totalCount ? page + 1 : null,
    totalCount,
  });
}
