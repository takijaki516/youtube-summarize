"use client";

import * as React from "react";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { googleSignIn } from "@/actions/auth";

export function GoogleLoginButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const handleClick = async () => {
    startTransition(async () => {
      try {
        await googleSignIn();
        setIsOpen(false);
      } catch (error) {
        console.error("Error signing in:", error);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Choose a method to sign in to your account.
          </DialogDescription>
        </DialogHeader>
        <Button
          className="w-full max-w-sm"
          disabled={isPending}
          onClick={handleClick}
        >
          <LogIn className="mr-2 h-4 w-4" />
          {isPending ? "Signing in..." : "Sign in with Google"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
