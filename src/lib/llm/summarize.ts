import { TokenTextSplitter } from "langchain/text_splitter";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const summarizeTranscriptWithGpt = async (
  transcript: string,
  model: "gpt-3.5-turbo" | "gpt-4o"
) => {
  const splitter = new TokenTextSplitter({
    encodingName: "gpt2",
    chunkSize: model === "gpt-4o" ? 12800 : 16000,
    chunkOverlap: 20,
  });

  const gpt = new ChatOpenAI({
    model,
    temperature: 0,
  });

  try {
    const outputs = await splitter.createDocuments([transcript]);

    const summaryPromises = outputs.map(async (output) => {
      const prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          "You are a highly skilled AI trained in language compression. Compress the following text to the most efficient form possible. Be precise!",
        ],
        ["human", output.pageContent],
      ]);

      const chain = prompt.pipe(gpt); // REVIEW:
      const res = await chain.invoke({});

      if (!res) {
        throw new Error("An error occurred while summarizing the transcript");
      }

      return res.content as string;
    });

    const summaries = await Promise.all(summaryPromises);

    // join all the summaries together and query llm to summarize them
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a highly skilled AI trained in language comprehension and summarization",
      ],
      ["human", summaries.join()],
    ]);

    const chain = prompt.pipe(gpt);
    const res = await chain.invoke({});

    if (!res) {
      throw new Error("An error occurred while summarizing the transcript");
    }

    return res.content;
  } catch (e) {
    console.error(e);
    return null;
  }
};
