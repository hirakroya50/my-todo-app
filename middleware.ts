import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/auth.config";

const LAST_PROJECT_COOKIE = "last_project_id";

export default NextAuth(authConfig).auth((req) => {
  const { pathname } = req.nextUrl;
  const projectMatch = pathname.match(/^\/projects\/([^/]+)/);

  if (projectMatch && req.auth?.user) {
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

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|api/health|.*\\..*).*)",
  ],
};
