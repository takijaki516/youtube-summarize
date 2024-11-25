import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYouTubeVideoId(url: string) {
  const regex = /v=([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
