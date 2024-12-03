"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Send, RotateCw, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLLMStore } from "@/lib/store/llm-store";
import { TranscriptRequestSchema } from "@/types/types";

export function WelcomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [inputUrl, setInputUrl] = React.useState("");
  const { currentLLM, currentEmbedding } = useLLMStore();

  const generateSummary = async () => {
    try {
      setIsLoading(true);

      const validated = TranscriptRequestSchema.safeParse({
        url: inputUrl,
        model: currentLLM?.model,
        provider: currentLLM?.provider,
        embeddingModel: currentEmbedding?.model,
        embeddingProvider: currentEmbedding?.provider,
      });

      // TODO: better error
      if (!validated.success) {
        toast.error(`Provide URL, API Key, Embedding Settings`);
        return;
      }

      const { url, model, provider, embeddingModel, embeddingProvider } =
        validated.data;

      const res = await fetch("/api/transcript", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          url,
          model,
          provider,
          embeddingModel,
          embeddingProvider,
        }),
      });

      if (!res.ok) {
        toast.error("Failed to generate summary");
        return;
      }

      const { vId } = await res.json();
      router.push(`/video/${vId}`);
    } catch (error) {
      toast.error("Not possible to generate summary");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-background py-14">
      <section className="w-full">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-10 text-center">
            <motion.h1
              className="max-w-xl text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="animate-gradient inline-block bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
                Summarize YouTube Videos In Seconds
              </span>
            </motion.h1>

            <motion.p
              className="max-w-[700px] text-xl text-foreground md:text-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              Get concise summaries of any YouTube video using our advanced
              AI-powered transcript summarizer.
            </motion.p>

            <motion.div
              className="relative mt-10 w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              <Input
                type=""
                id="url"
                placeholder="youtube url"
                className="w-full"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
              />

              <Button
                className="absolute right-0 top-0 mt-0 hover:bg-primary hover:text-primary-foreground"
                size="icon"
                variant={"ghost"}
                onClick={generateSummary}
              >
                {isLoading ? <RotateCw className="animate-spin" /> : <Send />}
              </Button>

              {isLoading && (
                <Button>
                  <X />
                  Cancel
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
