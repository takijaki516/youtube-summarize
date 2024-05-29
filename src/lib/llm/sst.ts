import path from "node:path";
import { Readable } from "node:stream";
import ytdl from "ytdl-core";
import FormData from "form-data";
import fetch from "node-fetch";

export const sstYoutubeVideo = async (link: string) => {
  try {
    const videoInfo = await ytdl.getInfo(link);
    const format = ytdl.chooseFormat(videoInfo.formats, {
      filter: "audioonly",
      quality: "lowest",
    });

    if (!format) {
      throw new Error("No audio format found for the video");
    }

    // REVIEW: downloadFromInfo return stream
    const audioStream = ytdl.downloadFromInfo(videoInfo, { format: format });
    const audioBuffer = await streamToBuffer(audioStream);

    // if audio is larger than 25MB,
    if (audioBuffer.length / (1024 * 1024) > 25) {
      throw new Error("Audio is too large to process");
    }

    const audioFile = Buffer.from(audioBuffer);
    const audioFileStream = new Readable();
    audioFileStream.push(audioFile);
    audioFileStream.push(null);

    const formData = new FormData();
    // REVIEW:
    formData.append("file", audioFileStream, {
      filename: path.basename(`${videoInfo.videoDetails.videoId}.mp3`),
      contentType: "audio/mpeg",
    });

    formData.append("model", "whisper-1");
    formData.append("timestamp_granularities", ["word"]);
    formData.append("response_format", "verbose_json");

    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        ...formData.getHeaders(),
      },
    });
    const response: any = await res.json();
    const transcription = response.text;
    return transcription;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// REVIEW: stream
const streamToBuffer = (stream: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    // REVIEW: on event
    stream.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    stream.on("end", () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });

    stream.on("error", (error: Error) => reject(error));
  });
};
