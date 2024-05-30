import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";

import { sstYoutubeVideo } from "./sst";

export const transcriptVideo = async (link: string) => {
  const loader = YoutubeLoader.createFromUrl(link, { addVideoInfo: true });

  try {
    const docs = await loader.load();
    if (!docs[0].pageContent) {
      throw new Error("An error occurred while loading the video");
    }

    return docs[0].pageContent;
  } catch (e) {
    try {
      console.log("Could not find captions... using whisper");
      const transcript = await sstYoutubeVideo(link);

      if (!transcript) {
        throw new Error("An error occurred on whisper model");
      }

      return transcript;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
};
