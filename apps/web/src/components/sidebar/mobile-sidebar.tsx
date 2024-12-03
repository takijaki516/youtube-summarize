"use client";

import * as React from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarHomeButton } from "./sidebar-home-button";
import { SidebarTranscriptVideo } from "./transcript-video";
import { SidebarAISetting } from "./ai-setting";
import { ModeToggle } from "../theme-toggle";

export function MobileSidebar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        size="icon"
        className="absolute left-2 top-2 rounded-full sm:hidden"
      >
        <Menu className="h-6 w-6" />
      </Button>

      <SheetContent
        side="left"
        className="flex w-[80px] flex-col items-center justify-center p-0"
      >
        <SidebarHomeButton />
        <SidebarTranscriptVideo />
        <SidebarAISetting />
        <ModeToggle side="right" align="start" />
      </SheetContent>
    </Sheet>
  );
}
