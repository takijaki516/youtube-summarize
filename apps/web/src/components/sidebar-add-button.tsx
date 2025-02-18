"use client";

import { useState } from "react";
import { Loader2, Plus, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function AddVideoDialog() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const generateSummary = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/transcript", {
        method: "POST",
        body: JSON.stringify({
          url,
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          toast.error(
            "한도를 초과했습니다. 하루에 10회까지 요청할 수 있습니다.",
          );
        }

        const { message } = await res.json();
        toast.error(message);
      } else {
        const vId = (await res.json()).vId;
        router.push(`/v/${vId}`);
      }
    } catch (error) {
      toast.error(
        "동영상 요약을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.",
      );
    }

    setIsOpen(false);
    setUrl("");
    setIsLoading(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!isLoading) {
      setIsOpen(open);
      return;
    }

    toast.info("요청을 처리 중입니다. 잠시만 기다려주세요.");
  };

  return (
    <Tooltip>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-md">
              <Plus className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-light">원하는 유튜브 영상을 요약해보세요</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="유튜브 영상 URL을 입력하세요"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <Button
              onClick={generateSummary}
              className="flex items-center justify-center bg-primary/70 transition-colors hover:bg-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                "요약하기"
              )}
            </Button>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <Info className="size-4 text-muted-foreground/70" />
            <span className="text-sm text-muted-foreground/70">
              현재는 30분 이하의 동영상만 처리 가능합니다.
            </span>
          </div>
        </DialogContent>
      </Dialog>

      <TooltipContent side="right">
        <p>새 동영상 요약</p>
      </TooltipContent>
    </Tooltip>
  );
}
