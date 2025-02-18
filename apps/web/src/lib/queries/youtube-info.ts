import { env } from "@/env";
import { extractVideoId, parseDuration } from "../utils";

export async function getMinimalVideoInfoFromAPI(url: string) {
  const videoId = extractVideoId(url);

  const processedURL = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&fields=items(id,snippet(title),contentDetails(duration))&key=${env.GOOGLE_YOUTUBE_API_KEY}`;
  const response = await fetch(processedURL);
  const data = (await response.json()) as {
    items: {
      id: string;
      snippet: { title: string };
      contentDetails: { duration: string };
    }[];
  };

  if (!data.items || !data.items[0]) {
    throw new Error("Video not found");
  }

  return {
    videoId: data.items[0].id,
    title: data.items[0].snippet.title,
    duration: parseDuration(data.items[0].contentDetails.duration),
  };
}
