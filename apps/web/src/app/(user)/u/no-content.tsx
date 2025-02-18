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
      toast.error("올바른 유튜브 URL을 입력해주세요");
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
          toast.error("한도 초과입니다. 잠시 후 다시 시도해주세요");
          return;
        }

        toast.error("요약 생성에 실패했습니다");
        return;
      }

      const vId = (await res.json()).vId;
      router.push(`/v/${vId}`);
    } catch (error) {
      toast.error("요약 생성에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mt-20 max-w-md text-4xl md:text-5xl lg:text-6xl">
        <h1 className="text-center text-foreground">
          원하는 영상을
          <br /> 요약해보세요!
        </h1>
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
