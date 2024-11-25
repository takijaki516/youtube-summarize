import Link from "next/link";
import { Home } from "lucide-react";

import { ModeToggle } from "./theme-toggle";
import { GoogleLoginButton } from "./login-button";

export function Navbar() {
  return (
    <header className="container sticky top-0 flex h-16 items-center justify-between bg-background/50 py-8 backdrop-blur-lg">
      <Link
        className="flex items-center justify-center text-2xl font-bold text-foreground"
        href="/"
      >
        <Home className="mr-2 block h-6 w-6 lg:hidden" />
        <span className="hidden font-bold lg:inline">YT Summarizer</span>
      </Link>

      <nav className="flex items-center gap-4 sm:gap-6">
        <GoogleLoginButton />
        <ModeToggle side="bottom" align="end" />
      </nav>
    </header>
  );
}
