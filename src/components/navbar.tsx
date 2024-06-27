import Link from "next/link";

import { ModeToggle } from "./theme-toggle";

export const Navbar = async () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b ">
      <div className="container flex h-16 items-center ">
        <div className="flex items-center">
          <Link href="/">HOME</Link>
        </div>

        <div className="flex flex-1 items-center justify-end">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};
