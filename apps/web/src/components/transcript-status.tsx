"use client";

import { Check, RotateCcw, Square } from "lucide-react";
import { TRANSCRIPT_STATUS_KEYS, TRANSCRIPT_STATUS } from "@/types/types";

interface TranscriptStatusProps {
  currentStatus: (typeof TRANSCRIPT_STATUS_KEYS)[number];
}

export function TranscriptStatus({
  currentStatus = "1",
}: TranscriptStatusProps) {
  return (
    <div className="flex flex-col gap-1">
      {Object.entries(TRANSCRIPT_STATUS).map(([statusKey, statusText], idx) => {
        let statusIcon;
        if (parseInt(statusKey) < parseInt(currentStatus)) {
          statusIcon = <Check className="size-4 text-green-600" />;
        } else if (parseInt(statusKey) === parseInt(currentStatus)) {
          statusIcon = (
            <RotateCcw className="size-4 animate-spin text-blue-600" />
          );
        } else {
          statusIcon = <Square className="size-4 text-gray-600" />;
        }

        return (
          <div className="flex items-center gap-2" key={idx}>
            {statusIcon}
            <div>{statusText}</div>
          </div>
        );
      })}
    </div>
  );
}
