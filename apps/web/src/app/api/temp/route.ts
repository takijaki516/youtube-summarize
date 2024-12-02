import { headers } from "next/headers";
import { checkRateLimit, RateLimitError } from "@/lib/rate-limit";
import ytdl from "ytdl-core";
import { HttpsProxyAgent } from "https-proxy-agent";

import { dbDrizzle, tempVideosSchema } from "@repo/database";
import { embedTranscript } from "@/lib/llm/embedding";
import {
  generateMarkdown,
  getTranscript,
  mergeTranscript,
} from "@/lib/llm/transcript";
import { generateSummary } from "@/lib/llm/summarize";

// TODO: implement rate limiting
export async function POST(req: Request) {
  try {
    const headersList = headers();
    const ip = headersList.get("x-forwarded-for") || "127.0.0.1";

    // 2 requests per 10 minutes per IP
    await checkRateLimit(`temp:${ip}`, 2, 10 * 60 * 1000);

    const { url } = await req.json();

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    // NOTE: move this to env variable
    const proxyHost = "gw.dataimpulse.com";
    const proxyPort = 823;
    const proxyLogin = "6761d7c7a193126692e4";
    const proxyPassword = "6ed548246001ec5e";
    const proxyUrl = `http://${proxyLogin}:${proxyPassword}@${proxyHost}:${proxyPort}`;

    const httpProxyAgent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;

    const videoInfo = await ytdl.getBasicInfo(url, {
      requestOptions: {
        agent: proxyUrl ? httpProxyAgent : undefined,
        headers: {
          // Add common browser headers to look more legitimate
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          Connection: "keep-alive",
        },
      },
    });

    const transcripts = await getTranscript(url, {
      agent: httpProxyAgent,
    });
    const mergedTranscript = mergeTranscript(transcripts);
    const tempSummaryText = await generateSummary(mergedTranscript);

    // TODO: change video ID to be uuid so we can use when storing embeddings which makes inserting video later with generated summary
    const videoTitle = videoInfo.videoDetails.title;
    const insertedVideo = await dbDrizzle
      .insert(tempVideosSchema)
      .values({
        url,
        title: videoTitle,
        summary: "not yet generated",
      })
      .returning({
        id: tempVideosSchema.id,
      });

    const videoId = insertedVideo[0]?.id;
    if (!videoId) {
      throw new Error("Video ID is undefined");
    }

    await embedTranscript(transcripts, {
      videoId,
      isTemp: true,
    });
    await generateMarkdown(tempSummaryText, url, {
      videoId: videoId,
      isTemp: true,
    });

    return Response.json(
      { message: "Embedded Transcript", vId: videoId },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in /api/temp:", error);

    if (error instanceof RateLimitError) {
      return Response.json({ error: "Too many requests" }, { status: 429 });
    }

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
