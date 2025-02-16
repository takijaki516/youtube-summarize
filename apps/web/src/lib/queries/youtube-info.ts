import { env } from "@/env";
import { extractVideoId } from "../utils";

export async function getMinimalVideoInfoFromAPI(url: string) {
  const videoId = extractVideoId(url);
  const processedURL = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&fields=items(id,snippet(title))&key=${env.GOOGLE_YOUTUBE_API_KEY}`;
  const response = await fetch(processedURL);
  const data = await response.json();

  if (!data.items || data.items.length === 0)
    throw new Error("Video not found");

  return {
    videoId: data.items[0]!.id,
    title: data.items[0]!.snippet.title,
  };
}
