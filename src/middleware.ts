import { NextResponse, type NextRequest } from "next/server";

// Routes that don't require authentication
const publicPaths = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/set-password",
  // Public marketing site (§5.1)
  "/about",
  "/community",
  "/partners",
  "/mentors",
  "/resources",
  "/join",
  "/contact",
];

// Treat the root path "/" as public (landing page).
const publicExactPaths = new Set(["/"]);

// Middleware runs on the edge - we can't check JWT here since the access token
// is stored in memory (not cookies). Instead, we use lightweight cookie checks
// for the refresh token to determine if the user might be authenticated,
// and let client-side guards handle the actual auth validation.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let public paths through
  if (publicExactPaths.has(pathname) || publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Let API routes, static files, and health checks through
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname === "/health" || pathname.includes(".")) {
    return NextResponse.next();
  }

  // For protected routes, check if session cookie exists
  // (refresh_token has path /api/v1/auth so middleware can't see it;
  //  we use a lightweight logged_in cookie set from JS with path /)
  const hasSession = request.cookies.has("logged_in");
  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|en-logo).*)"],
};
