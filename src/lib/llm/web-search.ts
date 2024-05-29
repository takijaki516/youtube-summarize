import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { DynamicTool } from "@langchain/core/tools";
import { convertToOpenAIFunction } from "@langchain/core/utils/function_calling";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor } from "langchain/agents";
import { z } from "zod";
import {
  AIMessage,
  FunctionMessage,
  BaseMessage,
} from "@langchain/core/messages";
import { AgentFinish, AgentStep } from "@langchain/core/agents";
import { FunctionsAgentAction } from "langchain/agents/openai/output_parser";
import { zodToJsonSchema } from "zod-to-json-schema";

export const searchResponseSchema = z.object({
  isAccurate: z
    .enum(["true", "false"])
    .describe("whether the video is accurate or not."),
  source: z.string().url().describe("the source of the video on web"),
  text: z.string().describe("extra information about the video"),
});

const llm = new ChatOpenAI({
  model: "gpt-3.5-turbo",
});

// REVIEW:
const searchTool = new DynamicTool({
  name: "web-search", // used by llm to determine when to call this function
  description: "Tool for getting the latest information from the web", // used by llm to determine when to call this function
  // when an error occurs, the function should, when possible, return a string representing an error,
  // this allows the error to be passed to LLM and LLM can decide how to handle it.
  // If error is thrown, execution will stop.
  // https://js.langchain.com/v0.1/docs/modules/agents/tools/dynamic/
  func: async (searchQuery: string, runManager) => {
    const retriever = new TavilySearchAPIRetriever();
    const docs = await retriever.invoke(searchQuery, runManager?.getChild());
    return docs.map((doc) => doc.pageContent).join("\n-----\n");
  },
});

const responseOpenAIFunction = {
  name: "response",
  description: "Return the response to the user",
  parameters: zodToJsonSchema(searchResponseSchema),
};

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You're a seasoned web researcher, adept at ferreting out information",
  ],
  ["human", "{input}"],
  new MessagesPlaceholder("agent_scratchpad"),
]);

const structuredOutputParse = (
  message: AIMessage
): FunctionsAgentAction | AgentFinish => {
  if (message.content && typeof message.content !== "string") {
    throw new Error("agent output is not a string");
  }

  if (message.additional_kwargs.function_call) {
    const { function_call } = message.additional_kwargs;
    try {
      const toolInput = function_call.arguments
        ? JSON.parse(function_call.arguments)
        : {};
      if (function_call.name === "response") {
        return { returnValues: { ...toolInput }, log: message.content };
      }

      return {
        tool: function_call.name,
        toolInput,
        log: `Invoking "${function_call.name}" with ${
          function_call.arguments ?? "{}"
        }\n${message.content}`,
        messageLog: [message],
      };
    } catch (error) {
      throw new Error(`Failed to parse function`);
    }
  } else {
    return {
      returnValues: { output: message.content },
      log: message.content,
    };
  }
};

const formatAgentSteps = (steps: AgentStep[]): BaseMessage[] => {
  // REVIEW:
  return steps.flatMap(({ action, observation }) => {
    if ("messageLog" in action && action.messageLog !== undefined) {
      const log = action.messageLog as BaseMessage[];
      return log.concat(new FunctionMessage(observation, action.tool));
    } else {
      return [new AIMessage(action.log)];
    }
  });
};

const llmWithTools = llm.bind({
  // REVIEW: convertToOpenAIFunction
  functions: [convertToOpenAIFunction(searchTool), responseOpenAIFunction],
});

const runnableAgent = RunnableSequence.from<{
  input: string;
  steps: Array<AgentStep>;
}>([
  {
    input: (i) => i.input,
    agent_scratchpad: (i) => formatAgentSteps(i.steps),
  },
  prompt,
  llmWithTools,
  structuredOutputParse,
]);

export const searchUsingTavilly = async (summary: string) => {
  const executor = AgentExecutor.fromAgentAndTools({
    agent: runnableAgent,
    tools: [searchTool],
  });

  const result = await executor.invoke({
    input: summary,
  });

  return JSON.stringify(result);
};
