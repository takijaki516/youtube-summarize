"use client";

import * as React from "react";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import type { Video } from "@repo/database";
import { Button } from "@/components/ui/button";

export function VideoCard({ video }: { video: Video }) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const queryClient = useQueryClient();

  const deleteVideo = async () => {
    try {
      setIsDeleting(true);

      const res = await fetch(`/api/videos`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
        body: JSON.stringify({ id: video.id }),
      });

      if (!res.ok) {
        toast.error("Failed to delete video");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast.success("Video deleted successfully");
    } catch (error) {
      toast.error("Failed to delete video");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-md border border-border p-4 transition-transform duration-200 ease-in hover:scale-[1.02] hover:cursor-pointer hover:border-foreground">
      <Link href={`/video/${video.id}`} className="flex flex-col gap-4">
        <div>{video.title}</div>

        {new Date(video.updatedAt).toLocaleString("ko-KR")}
      </Link>

      <Button
        variant="destructive"
        onClick={deleteVideo}
        disabled={isDeleting}
        className="ml-16"
      >
        {isDeleting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Trash2 className="size-4" />
        )}
      </Button>
    </div>
  );
}