"use client";

import * as React from "react";
import { Loader, LogOut, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SidebarUserButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  async function signOutHandler() {
    setIsLoading(true);

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/");
        },
        onError: () => {
          toast.error("로그아웃에 실패했어요. 다시 시도해주세요");
        },
      },
    });

    setIsLoading(false);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" side="right" className="w-fit">
        <DropdownMenuItem className="p-0">
          <Button
            variant="destructive"
            className="flex w-full items-center justify-around"
            onClick={signOutHandler}
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            <span>로그아웃</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
