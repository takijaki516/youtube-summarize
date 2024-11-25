"use client";

import { useRouter } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";

export function SidebarDashboardButton() {
  const router = useRouter();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={() => router.push("/u")}
          variant="ghost"
          size="icon"
          className="cursor-pointer"
        >
          <LayoutDashboard />
        </Button>
      </TooltipTrigger>

      <TooltipContent>
        <p>Dashboard</p>
      </TooltipContent>
    </Tooltip>
  );
}
