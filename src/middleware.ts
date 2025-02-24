import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

interface SessionData {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const session: IronSession<SessionData> = await getIronSession<SessionData>(
    req,
    res,
    sessionOptions
  );

  if (!session.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { role } = session.user;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/user-dashboard") && role === "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname.startsWith("/dashboard") && role === "user") {
    return NextResponse.redirect(new URL("/user-dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/api/create",
    "/user-dashboard",
    "/dashboard",
    "/api/delete",
    "/api/update",
  ],
};
