import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session";

interface CustomSessionData {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export async function GET(request: Request) {
  try {
    const session = await getIronSession<CustomSessionData>(
      await cookies(),
      sessionOptions
    );
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const applications = await prisma.application.findMany({
      where: { userId },
      include: { job: true },
    });

    return NextResponse.json(applications, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error fetching applications" },
      { status: 500 }
    );
  }
}
