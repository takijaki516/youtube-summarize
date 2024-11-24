"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Send, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NoContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [url, setUrl] = React.useState("");

  const generateSummary = async () => {
    setIsLoading(true);

    const res = await fetch("/api/transcript", {
      method: "POST",
      body: JSON.stringify({
        url,
      }),
    });

    const vId = (await res.json()).vId;

    router.push(`/v/${vId}`);
    setIsLoading(false);
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
          className="w-full"
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
