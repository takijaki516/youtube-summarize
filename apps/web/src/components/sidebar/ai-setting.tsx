"use client";

import * as React from "react";
import { Bot } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GPTLogo } from "../llm-logo/gpt-logo";

export function SidebarAISetting() {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  return (
    <Tooltip>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bot className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings For you AI</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <GPTLogo />
              <span>GPT-4o</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TooltipContent>
        <p>Add Video</p>
      </TooltipContent>
    </Tooltip>
  );
}
