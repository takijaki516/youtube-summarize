"use client";

import * as React from "react";
import { LogOut, UserIcon } from "lucide-react";
import type { Session } from "next-auth";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { signOut } from "../auth";
import { signOutAction } from "../actions/auth";

interface SidebarUserButtonProps {
  session: Session;
}

export function SidebarUserButton({ session }: SidebarUserButtonProps) {
  return (
    <Tooltip>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="cursor-pointer">
              <UserIcon />
            </Button>
          </TooltipTrigger>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" side="right" className="w-fit">
          <DropdownMenuItem className="p-0">
            <form action={signOutAction} className="w-full">
              <Button
                type="submit"
                variant="destructive"
                className="flex w-full justify-between"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TooltipContent>
        <p>User</p>
      </TooltipContent>
    </Tooltip>
  );
}
