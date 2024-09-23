import Link from "next/link";
import { Youtube, Zap, BookOpen, Share2 } from "lucide-react";
import { ModeToggle } from "./theme-toggle";

export const Navbar = async () => {
  return (
    <header className="sticky top-0 flex h-16 items-center justify-between bg-background/40 px-4 backdrop-blur-lg lg:px-6">
      <Link className="flex items-center justify-center" href="#">
        <Youtube className="h-6 w-6 text-red-600" />
        <span className="ml-2 text-2xl font-bold text-foreground">
          YT Summarizer
        </span>
      </Link>

      <nav className="flex items-center gap-4 sm:gap-6">
        <Link className="text-sm font-medium underline-offset-4" href="#">
          Features
        </Link>
        <Link className="text-sm font-medium underline-offset-4" href="#">
          Pricing
        </Link>
        <ModeToggle />
      </nav>
    </header>
  );
};
