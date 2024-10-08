// "use server";

// import { revalidatePath } from "next/cache";
// import ytdl from "ytdl-core";
// import { z } from "zod";
// import { type MessageContent } from "@langchain/core/messages";

// import { formSchema } from "@/components/summarize-form";
// import { summarizeTranscriptWithGpt } from "@/lib/llm/summarize";
// import { transcriptVideo } from "@/lib/llm/transcript";
// import { RegenerateSummaryFormSchema } from "@/components/regenerate-summary";
// import { FactCheckFormSchema } from "@/components/fact-check";
// import { searchUsingTavilly } from "@/lib/llm/web-search";

// export type FactCheckerResponse = {
//   input: "string";
//   isAccurate: "true" | "false";
//   source: string;
//   text: string;
// };

// export const handleInitialFormSubmit = async (
//   formData: z.infer<typeof formSchema>,
// ) => {
//   try {
//     const videoInfo = await ytdl.getInfo(formData.link);
//     const videoId = videoInfo.videoDetails.videoId;

//     const existingVideo = await prismaDB.videos.findUnique({
//       where: {
//         videoId: videoId,
//       },
//     });

//     // NOTE: if video already exists
//     if (existingVideo) {
//       return existingVideo.videoId;
//     }

//     const transcript = await transcriptVideo(formData.link);

//     if (!transcript) {
//       throw new Error("Could not get transcript");
//     }

//     await prismaDB.videos.create({
//       data: {
//         videoId: videoId,
//         transcript: transcript,
//         title: videoInfo.videoDetails.title,
//       },
//     });

//     let summary: MessageContent | null = null;

//     // NOTE: openai models
//     if (formData.model == "gpt-3.5-turbo" || formData.model == "gpt-4o") {
//       summary = await summarizeTranscriptWithGpt(transcript, formData.model);
//     } else {
//       // TODO: Implement other models
//     }

//     if (!summary) {
//       throw new Error("error on generating summary");
//     }

//     await prismaDB.videos.update({
//       where: {
//         videoId: videoId,
//       },
//       data: {
//         summary: summary as string,
//       },
//     });

//     return videoId;
//   } catch (e) {
//     return null;
//   } finally {
//     revalidatePath("/");
//     revalidatePath("/summaries");
//   }
// };

// export const handleRegenerateSummary = async (
//   formData: z.infer<typeof RegenerateSummaryFormSchema>,
// ) => {
//   try {
//     const video = await prismaDB.videos.findUnique({
//       where: {
//         videoId: formData.videoId,
//       },
//     });

//     if (!video) {
//       throw new Error("Video not found");
//     }

//     let summary: MessageContent | null = null;

//     if (formData.model == "gpt-3.5-turbo" || formData.model == "gpt-4o") {
//       summary = await summarizeTranscriptWithGpt(
//         video.transcript,
//         formData.model,
//       );
//     } else {
//       // TODO: Implement other models
//     }

//     if (!summary) {
//       throw new Error("Could not summarize the transcript");
//     }

//     await prismaDB.videos.update({
//       where: {
//         videoId: formData.videoId,
//       },
//       data: {
//         summary: summary as string,
//       },
//     });

//     return true;
//   } catch (error) {
//     console.error(error);
//     return false;
//   } finally {
//     revalidatePath(`/${formData.videoId}`);
//   }
// };

// // REVIEW:
// export const checkFacts = async (
//   formData: z.infer<typeof FactCheckFormSchema>,
// ) => {
//   try {
//     const res = await searchUsingTavilly(formData.summary);
//     return await JSON.parse(res);
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };
