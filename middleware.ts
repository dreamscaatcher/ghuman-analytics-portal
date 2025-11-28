import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hasRegisteredCookie = request.cookies.has("registered");

  if (hasRegisteredCookie) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/register", "/register/:path*", "/login", "/login/:path*"],
};
