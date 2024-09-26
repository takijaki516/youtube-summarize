import fs from "node:fs";
// import { chromium } from "playwright";
import { YoutubeTranscript } from "youtube-transcript";

import { TranscriptSegment } from "../types";

export async function getTranscript(url: string): Promise<TranscriptSegment[]> {
  const transcripts = await YoutubeTranscript.fetchTranscript(url);

  let cur = 0;

  while (cur < transcripts.length - 1) {
    if (transcripts[cur].text.length < 125) {
      transcripts[cur].text += ` ${transcripts[cur + 1].text}`;
      transcripts.splice(cur + 1, 1);
    } else {
      cur++;
    }
  }

  return transcripts;
}

export function mergeTranscript(transcripts: TranscriptSegment[]): string {
  let mergedTranscript = "";

  for (const segment of transcripts) {
    mergedTranscript += `${segment.text} `;
  }

  return mergedTranscript;
}

// REVIEW: about this regex
// export async function generateMarkdown(transcript: string, url: string) {
//   const placeholders = transcript.match(/<.+?>/g);

//   if (!placeholders) {
//     return;
//   }

//   for (const placeholder of placeholders) {
//     const resplacementText = await processPlaceholder(placeholder, url);
//     transcript = transcript.replace(placeholder, resplacementText);
//   }

//   fs.writeFileSync("summarized_transcript.md", transcript);
// }

// async function processPlaceholder(placeholder: string, url: string) {
//   let deteleTimeFromURL = url.replace(/&t=\d+s/, "");

//   if (placeholder.startsWith("<PICTURE:")) {
//     const description = placeholder.slice(9, -1);
//     const result = await similarText(description);

//     const timestamp = Math.floor(result.start);
//     const formattedTime = secondsToHMS(timestamp);

//     const imageFileName = `frames/screenshot-${timestamp}.jpg`;
//     const hyperlink = `${deteleTimeFromURL}&t=${timestamp}s`;
//     // await takeYouTubeVideoScreenshot(
//     //   deteleTimeFromURL,
//     //   timestamp,
//     //   imageFileName,
//     // );

//     return `<img src="${imageFileName}" alt="${description}" width="450" /> <br /> [Jump to this part of the video: ${formattedTime}](${hyperlink})`;
//   } else if (placeholder.startsWith("<HYPERLINK:")) {
//     const text = placeholder.slice(11, -1);
//     const result = await similarText(text);

//     const timestamp = Math.floor(result.start);
//     const formattedTime = secondsToHMS(timestamp);

//     const hyperlink = `${deteleTimeFromURL}&t=${timestamp}s`;

//     return `[Jump to this part of the video: ${formattedTime}](${hyperlink})`;
//   } else {
//     return placeholder;
//   }
// }

function secondsToHMS(time: number): string {
  const hours = Math.floor(time / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((time % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

// async function takeYouTubeVideoScreenshot(
//   videoUrl: string,
//   timestamp: number,
//   outputPath: string,
// ) {
//   const browser = await chromium.launch();
//   const page = await browser.newPage();

//   try {
//     // Navigate to the YouTube video
//     await page.goto(videoUrl);

//     // Wait for the video player to load
//     await page.waitForSelector("video");

//     // Seek to the specified timestamp
//     await page.evaluate((time) => {
//       const video = document.querySelector("video");
//       if (video) {
//         video.currentTime = time;
//       }
//     }, timestamp);

//     // Wait for the video to load at the new timestamp
//     await page.waitForTimeout(1000); // Adjust this value if needed

//     // Find the video player element
//     const videoPlayer = await page.locator("#movie_player");

//     // Take the screenshot of only the video player
//     await videoPlayer.screenshot({ path: outputPath });

//     console.log(`Screenshot saved to ${outputPath}`);
//   } catch (error) {
//     console.error("An error occurred:", error);
//   } finally {
//     await browser.close();
//   }
// }
