import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

interface SessionData {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const res = new NextResponse();
    const session = await getIronSession<SessionData>(req, res, {
      cookieName: sessionOptions.cookieName,
      password: sessionOptions.password,
      cookieOptions: sessionOptions.cookieOptions,
    });

    return NextResponse.json({
      user: session.user || null,
      isLoggedIn: !!session.user,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to get session" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
