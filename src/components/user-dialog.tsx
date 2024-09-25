"use client";

import * as React from "react";
import { LogOut, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function UserDialog() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DialogTrigger>

      <DialogContent className="max-h-svh bg-black text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold"></DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            History
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
