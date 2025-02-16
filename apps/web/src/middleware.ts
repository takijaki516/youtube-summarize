import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicRoutes = ["/"];
const authPages = ["/signin", "/signup"];

export function middleware(req: NextRequest) {
  // login/signup pages + user is already logged in
  if (authPages.includes(req.nextUrl.pathname)) {
    if (req.cookies.has("better-auth.session_token")) {
      return NextResponse.redirect(new URL("/u", req.url));
    }

    return NextResponse.next();
  }

  // public(guest) routes
  if (
    publicRoutes.includes(req.nextUrl.pathname) ||
    req.nextUrl.pathname.startsWith("/guest")
  ) {
    if (req.cookies.has("better-auth.session_token")) {
      return NextResponse.redirect(new URL("/u", req.url));
    }

    return NextResponse.next();
  }

  // private routes
  if (!req.cookies.has("better-auth.session_token")) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

// REVIEW:
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
