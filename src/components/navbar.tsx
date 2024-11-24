import Link from "next/link";

import { ModeToggle } from "./theme-toggle";
import { GoogleLoginButton } from "./login-button";

export function Navbar() {
  return (
    <header className="container sticky top-0 flex h-16 items-center justify-between bg-background/40 px-4 backdrop-blur-lg lg:px-6">
      <Link
        className="flex items-center justify-center text-2xl font-bold text-foreground"
        href="/"
      >
        YT Summarizer
      </Link>

      <nav className="flex items-center gap-4 sm:gap-6">
        <GoogleLoginButton />
        <ModeToggle side="bottom" align="end" />
      </nav>
    </header>
  );
}
