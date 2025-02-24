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

  const adminRoutes = [
    "/dashboard",
    "/addjobs",
    "/seeapplication",
    "/editjobs",
  ];
  const userRoutes = ["/user-dashboard", "/alljobs"];
  if (
    adminRoutes.some((route) => pathname.startsWith(route)) &&
    role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/user-dashboard", req.url));
  }

  if (
    userRoutes.some((route) => pathname.startsWith(route)) &&
    role !== "user"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/user-dashboard",
    "/alljobs",
    "/alljobs/:path*",

    "/dashboard",
    "/addjobs",
    "/seeapplication",
    "/editjobs/:path*",
    "/api/auth/addjob",
    "/api/auth/editjob/:path*",
    "/api/auth/jobs",
    "/api/auth/logout",
    "/api/auth/session",
  ],
};
