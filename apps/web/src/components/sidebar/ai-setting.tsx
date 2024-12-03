"use client";

import * as React from "react";
import { Bot, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OpenAILogo } from "@/components/llm-logo/openai-logo";
import { AnthropicLogo } from "@/components/llm-logo/anthropic-logo";
import { GeminiLogo } from "@/components/llm-logo/gemini-logo";
import { OllamaLogo } from "@/components/llm-logo/ollama-logo";
import {
  EMBEDDING_MODELS,
  type EMBEDDING_PROVIDER,
  type LLM,
  LLMS,
  useLLMStore,
} from "@/lib/store/llm-store";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function SidebarAISetting() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { currentLLM, setCurrentLLM, currentEmbedding, setCurrentEmbedding } =
    useLLMStore();

  const handleSelectLLM = (llm: LLM) => {
    setCurrentLLM(llm);
  };

  const handleSelectEmbedding = (embedding: EMBEDDING_PROVIDER) => {
    setCurrentEmbedding(embedding);
  };

  return (
    <Tooltip>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <Button
            onClick={() => setIsOpen(true)}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <Bot className="h-6 w-6" />
          </Button>
        </TooltipTrigger>

        <DialogContent className="h-full max-h-[400px]">
          <Tabs defaultValue="LLM" className="h-full w-full p-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="LLM">LLM</TabsTrigger>
              <TabsTrigger value="EMBEDDING">Embedding</TabsTrigger>
            </TabsList>

            <TabsContent value="LLM" className="h-[300px]">
              <ScrollArea className="h-full w-full pr-4">
                {LLMS.map((llm) => (
                  <button
                    key={llm.model}
                    className="flex w-full items-center justify-between rounded-md p-2 hover:bg-muted"
                    onClick={() => handleSelectLLM(llm)}
                  >
                    <div className="flex items-center gap-2">
                      {llm.provider === "openai" && <OpenAILogo />}
                      {llm.provider === "anthropic" && <AnthropicLogo />}
                      {llm.provider === "gemini" && <GeminiLogo />}
                      {llm.provider === "ollama" && <OllamaLogo />}
                      <span className="text-start">{llm.model}</span>
                    </div>

                    {currentLLM?.model === llm.model && (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="EMBEDDING">
              <ScrollArea className="pr-4">
                {EMBEDDING_MODELS.map((embedding) => (
                  <button
                    key={embedding.model}
                    className="flex w-full items-center justify-between rounded-md p-2 hover:bg-muted"
                    onClick={() => handleSelectEmbedding(embedding)}
                  >
                    <div className="flex items-center gap-2">
                      {embedding.provider === "openai" && <OpenAILogo />}
                      {embedding.provider === "ollama" && <OllamaLogo />}
                      <span className="text-start">{embedding.model}</span>
                    </div>

                    {currentEmbedding?.model === embedding.model && (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <TooltipContent>
        <p>Settings</p>
      </TooltipContent>
    </Tooltip>
  );
}
