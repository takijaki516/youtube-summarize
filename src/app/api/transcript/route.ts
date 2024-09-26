import ytdl from "ytdl-core";

import { auth } from "@/auth";
import { embedTranscript } from "@/lib/llm/embedding";
import {
  generateMarkdown,
  getTranscript,
  mergeTranscript,
} from "@/lib/llm/transcript";
import { dbDrizzle } from "@/lib/db/drizzle";
import { videos } from "@/lib/db/schema/video";
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

  const insertedVideo = await dbDrizzle
    .insert(videos)
    .values({
      url,
      title: videoTitle,
      userId,
    })
    .returning({
      id: videos.id,
    });

  await embedTranscript(transcripts, insertedVideo[0].id, userId);
  await generateMarkdown(summaryText, url, insertedVideo[0].id);

  return Response.json(
    { message: "Embedded Transcript", vId: insertedVideo[0].id },
    { status: 201 },
  );
});
