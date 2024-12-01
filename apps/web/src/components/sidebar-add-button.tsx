"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
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
          toast.error("Rate limit exceeded. Please try again later.");
          return;
        }

        toast.error("Failed to generate summary");
        return;
      }

      const vId = (await res.json()).vId;
      router.push(`/v/${vId}`);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      setUrl("");
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
