"use client";

import * as React from "react";
import { Send, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UserHomepage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [url, setUrl] = React.useState("");

  const router = useRouter();

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
    <main className="flex flex-1 flex-col items-center justify-center bg-background px-4">
      <div className="relative max-w-md text-4xl md:text-5xl lg:text-6xl">
        <h1 className="text-center text-foreground">Summarize Youtube video</h1>
        {/* <h1 className="animate-shimmer absolute left-0 top-0 w-full bg-[linear-gradient(110deg,rgba(255,255,255,0.3)_48%,rgba(255,255,255,1)_50%,rgba(255,255,255,0.3)_52%)] bg-[length:5%_100%] bg-clip-text bg-no-repeat text-center text-transparent">
          Summarize Youtube video start chatting and expand knowledge
        </h1> */}
      </div>
      <h2 className="pb-10 pt-4 text-xl">
        start chatting and expand knowledge
      </h2>

      <div className="relative w-full max-w-md">
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
    </main>
  );
}
