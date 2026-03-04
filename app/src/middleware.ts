import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/settings",
  "/profile",
  "/certificates",
  "/admin",
];

// Matches lesson pages: /courses/[slug]/lessons/[lessonSlug]
// localePrefix is "never", so URLs never have a locale segment.
// Also handles the edge case where a locale prefix somehow appears.
const LESSON_ROUTE_RE = /^\/(?:[^/]+\/)?courses\/[^/]+\/lessons(\/|$)/;

// Cookie names NextAuth v5 uses (matches the config's cookiePrefix logic)
const SESSION_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

function isProtected(pathname: string): boolean {
  // localePrefix is "never", so the pathname never contains a locale segment.
  // Check directly against the pathname.
  if (PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  )) {
    return true;
  }
  // Lesson content always requires auth
  if (LESSON_ROUTE_RE.test(pathname)) {
    return true;
  }
  return false;
}

function hasSessionCookie(request: NextRequest): boolean {
  return SESSION_COOKIE_NAMES.some((name) => !!request.cookies.get(name));
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isProtected(pathname)) {
    if (!hasSessionCookie(request)) {
      const signInUrl = new URL("/auth/signin", request.url);
      // Use the pathname only (not the full URL) so the callbackUrl is always
      // a clean relative path with no locale prefix or origin embedded in it.
      const callbackPath = request.nextUrl.pathname + (request.nextUrl.search || "");
      signInUrl.searchParams.set("callbackUrl", callbackPath);
      return NextResponse.redirect(signInUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|studio|.*\\..*).*)"],
};
