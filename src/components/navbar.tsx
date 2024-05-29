import Link from "next/link";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export const Navbar = async () => {
  return (
    <header className="z-40 w-full border-b backdrop-blur-md">
      <div className="container flex h-16 space-x-4 items-center sm:justify-between sm:space-x-0">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-xl">HOME</h1>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end">
          <nav className="flex items-center justify-center">
            <Button size={"icon"} variant={"link"} asChild>
              <Link href="/">AAA</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
