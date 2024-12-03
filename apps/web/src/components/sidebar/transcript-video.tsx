"use client";

import * as React from "react";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLLMStore } from "@/lib/store/llm-store";
import { TranscriptRequestSchema } from "@/types/types";

export function SidebarTranscriptVideo() {
  const [inputUrl, setInputUrl] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const { currentEmbedding, currentLLM } = useLLMStore();

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
      setIsOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!isLoading) {
      setIsOpen(open);
    }
  };

  return (
    <Tooltip>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <TooltipTrigger asChild>
          <Button
            onClick={() => setIsOpen(true)}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </TooltipTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add YouTube Video</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Enter YouTube URL"
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
            />
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <Button onClick={generateSummary}>Add Video</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <TooltipContent>
        <p>Add Video</p>
      </TooltipContent>
    </Tooltip>
  );
}
