import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Extracts the video id from a YouTube URL (supports full and short URLs)
export function extractVideoId(videoUrl: string): string {
  const url = new URL(videoUrl);
  // Standard URL (https://www.youtube.com/watch?v=...)
  let id = url.searchParams.get("v");
  if (id) return id;
  // Short URL format: https://youtu.be/...
  if (url.hostname === "youtu.be") {
    id = url.pathname.slice(1);
    if (id) return id;
  }
  throw new Error("Invalid YouTube video URL");
}

export function parseDuration(duration: string): number {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match || !match[1] || !match[2] || !match[3]) return 0;

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  return hours * 3600 + minutes * 60 + seconds;
}
