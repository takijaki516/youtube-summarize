"use client";

import * as React from "react";
import { Send, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NoContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [url, setUrl] = React.useState("");

  const generateSummary = async () => {
    if (!url) {
      toast.error("Please enter a valid URL");
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch("/api/transcript", {
        method: "POST",
        body: JSON.stringify({
          url,
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          toast.error("Rate limit exceeded. Please try again later.");
          return;
        }

        toast.error("Failed to generate summary");
        return;
      }

      const vId = (await res.json()).vId;
      router.push(`/v/${vId}`);
    } catch (error) {
      toast.error("Failed to generate summary");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-md text-4xl md:text-5xl lg:text-6xl">
        <h1 className="text-center text-foreground">Summarize Youtube video</h1>
      </div>

      <div className="relative mt-10 w-full max-w-md">
        <Input
          type=""
          id="url"
          placeholder="youtube url"
          className="w-full border-primary/80 focus:border-none"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <Button
          className="absolute right-0 top-0 hover:bg-primary hover:text-primary-foreground"
          size="icon"
          variant={"ghost"}
          onClick={generateSummary}
        >
          {isLoading ? <RotateCw className="animate-spin" /> : <Send />}
        </Button>
      </div>
    </>
  );
}
