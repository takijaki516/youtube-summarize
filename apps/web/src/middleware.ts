import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const authPages = ["/signin", "/signup"];

// just check for routing purpose in the middleware
const authCookieName = "better-auth.session_token";
const authSecureCookieName = "__Secure-better-auth.session_token";

export function middleware(req: NextRequest) {
  // login/signup pages + user is already logged in
  if (authPages.includes(req.nextUrl.pathname)) {
    if (
      req.cookies.has(authCookieName) ||
      req.cookies.has(authSecureCookieName)
    ) {
      return NextResponse.redirect(new URL("/u", req.url));
    }

    return NextResponse.next();
  }

  // user(private) routes
  if (
    req.nextUrl.pathname.startsWith("/u") ||
    req.nextUrl.pathname.startsWith("/v")
  ) {
    // not logged in
    if (
      !req.cookies.has(authCookieName) &&
      !req.cookies.has(authSecureCookieName)
    ) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    return NextResponse.next();
  }

  // public(guest) routes and logged in
  if (
    req.cookies.has(authCookieName) ||
    req.cookies.has(authSecureCookieName)
  ) {
    return NextResponse.redirect(new URL("/u", req.url));
  }

  // public(guest) routes
  return NextResponse.next();
}

// REVIEW:
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
