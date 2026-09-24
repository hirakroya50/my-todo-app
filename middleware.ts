import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const LAST_PROJECT_COOKIE = "last_project_id";

export function middleware(req: NextRequest) {
  const projectMatch = req.nextUrl.pathname.match(/^\/projects\/([^/]+)/);
  if (!projectMatch) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.cookies.set(LAST_PROJECT_COOKIE, projectMatch[1], {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/health|.*\\..*).*)",
  ],
};
