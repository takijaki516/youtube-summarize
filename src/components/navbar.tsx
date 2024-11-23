import Link from "next/link";
import { User } from "lucide-react";

import { ModeToggle } from "./theme-toggle";

import { auth } from "@/auth";
import { GoogleLoginButton } from "./login-button";
import { UserDialog } from "./user-dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="container sticky top-0 flex h-16 items-center justify-between bg-background/40 px-4 backdrop-blur-lg lg:px-6">
      <Link
        className="flex items-center justify-center text-2xl font-bold text-foreground"
        href="/"
      >
        YT Summarizer
      </Link>

      <nav className="flex items-center gap-4 sm:gap-6">
        {session ? (
          <Link
            href="/u"
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <User className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">user page</span>
          </Link>
        ) : null}

        {session ? <UserDialog /> : <GoogleLoginButton />}

        <ModeToggle />
      </nav>
    </header>
  );
}
