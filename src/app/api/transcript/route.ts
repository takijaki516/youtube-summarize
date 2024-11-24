import ytdl from "ytdl-core";

import { auth } from "@/auth";
import { embedTranscript } from "@/lib/llm/embedding";
import {
  generateMarkdown,
  getTranscript,
  mergeTranscript,
} from "@/lib/llm/transcript";
import { dbDrizzle } from "@/lib/db/drizzle";
import { videosSchema } from "@/lib/db/schema/video";
import { generateSummary } from "@/lib/llm/summarize";

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { url } = await req.json();
  const userId = req.auth.user.id;

  const videoInfo = await ytdl.getInfo(url);
  const videoTitle = videoInfo.videoDetails.title;

  const transcripts = await getTranscript(url);
  const mergedTranscript = mergeTranscript(transcripts);
  const summaryText = await generateSummary(mergedTranscript);

  // TODO: change video ID to be uuid so we can use when storing embeddings which makes inserting video later with generated summary
  const insertedVideo = await dbDrizzle
    .insert(videosSchema)
    .values({
      url,
      title: videoTitle,
      summary: "not yet generated",
      userId,
    })
    .returning({
      id: videosSchema.id,
    });

  // store embedding and its offset(time) for lookup when generating links(timestamps)
  await embedTranscript(transcripts, insertedVideo[0].id, userId);
  await generateMarkdown(summaryText, url, insertedVideo[0].id);

  return Response.json(
    { message: "Embedded Transcript", vId: insertedVideo[0].id },
    { status: 201 },
  );
});
