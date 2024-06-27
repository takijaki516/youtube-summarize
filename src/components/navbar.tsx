import Link from "next/link";

import { ModeToggle } from "./theme-toggle";

export const Navbar = async () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-2xl">
      <div className="container flex h-16 items-center ">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="hover:font-bold transition-all duration-200"
          >
            HOME
          </Link>
          <Link
            href="/summaries"
            className="hover:font-bold transition-all  duration-200"
          >
            MORE
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};
