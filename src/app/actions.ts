"use server";

import { revalidatePath } from "next/cache";
import ytdl from "ytdl-core";
import { z } from "zod";
import { type MessageContent } from "@langchain/core/messages";

import { prismaDB } from "@/lib/prisma-db";
import { formSchema } from "@/components/summary-form";

export type FactCheckerResponse = {
  input: "string";
  isAccurate: "true" | "false";
  source: string;
  text: string;
};

export const handleInitialFormSubmit = async (
  formData: z.infer<typeof formSchema>
) => {
  const start = Date.now();

  try {
    const videoInfo = await ytdl.getInfo(formData.link);
    const videoId = videoInfo.videoDetails.videoId;

    const existingVideo = await prismaDB.videos.findUnique({
      where: {
        videoId: videoId,
      },
    });

    if (existingVideo) {
      const exisitingSummary = await prismaDB.summaries.findMany({
        where: {
          videoId: videoId,
        },
        take: 1,
      });

      if (exisitingSummary) {
        return exisitingSummary[0].videoId;
      }

      let summary: MessageContent | null = null;
    }
  } catch (e) {
  } finally {
    console.log();
    revalidatePath("/");
    revalidatePath("/summaries");
  }
};

export const handleRegenerateSummary = async () => {};
