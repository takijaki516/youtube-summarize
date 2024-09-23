import Link from "next/link";

import { ModeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { auth } from "@/auth";
import { GoogleLoginButton } from "./login-button";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 flex h-16 items-center justify-between bg-background/40 px-4 backdrop-blur-lg lg:px-6">
      <Link
        className="flex items-center justify-center text-2xl font-bold text-foreground"
        href="/"
      >
        YT Summarizer
      </Link>

      <nav className="flex items-center gap-4 sm:gap-6">
        {session ? (
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ) : (
          <GoogleLoginButton />
        )}

        <ModeToggle />
      </nav>
    </header>
  );
}
