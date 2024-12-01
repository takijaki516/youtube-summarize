import Link from "next/link";
import { Home } from "lucide-react";

import { ModeToggle } from "./theme-toggle";
import { GoogleLoginButton } from "./login-button";

export function Navbar() {
  return (
    <nav className="container sticky top-0 flex h-16 items-center justify-between bg-background py-8">
      <Link
        className="flex items-center justify-center text-2xl font-bold text-primary transition-opacity hover:opacity-80"
        href="/"
      >
        <Home className="mr-2 block h-6 w-6 transition-transform hover:scale-110 lg:hidden" />
        <span className="hidden font-bold transition-colors hover:text-primary/90 lg:inline">
          YT Summarizer
        </span>
      </Link>

      <div className="flex items-center gap-4 sm:gap-6">
        <GoogleLoginButton />
        <ModeToggle side="bottom" align="end" />
      </div>
    </nav>
  );
}
