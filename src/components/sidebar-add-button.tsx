"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AddVideoDialog() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
    setUrl("");
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!isLoading) {
      setIsOpen(open);
    }
  };

  return (
    <Tooltip>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Plus className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add YouTube Video</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Enter YouTube URL"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
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
