"use client";

import * as React from "react";
import { Calendar, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import type { Video } from "@repo/database";
import { Button } from "@/components/ui/button";

export function VideoCard({ video }: { video: Video }) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const queryClient = useQueryClient();

  // TODO: add try catch to handle errors
  const deleteVideo = async () => {
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/videos`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
        body: JSON.stringify({ id: video.id }),
      });

      if (res.ok) {
        toast.success("Video deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["videos"] });
      } else {
        toast.error("Failed to delete video");
      }
    } catch (error) {
      toast.error(error as string);
    }

    setIsDeleting(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between rounded-md border border-border p-4 transition-transform duration-200 ease-in hover:scale-[1.02] hover:cursor-pointer hover:border-foreground">
        <Link href={`/v/${video.id}`} className="flex flex-col gap-4">
          <div>{video.title}</div>

          <div className="flex items-center gap-2">
            <Calendar className="size-4" />
            {new Date(video.updatedAt).toLocaleString("ko-KR")}
          </div>
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
    </div>
  );
}
