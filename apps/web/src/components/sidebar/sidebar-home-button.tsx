"use client";

import { useRouter } from "next/navigation";
import { Home } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export function SidebarHomeButton() {
  const router = useRouter();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={() => router.push("/")}
          variant="ghost"
          size="icon"
          className="cursor-pointer"
        >
          <Home />
        </Button>
      </TooltipTrigger>

      <TooltipContent>
        <p>Dashboard</p>
      </TooltipContent>
    </Tooltip>
  );
}
