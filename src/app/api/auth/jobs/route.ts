import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const jobs = await prisma.job.findMany();
    return NextResponse.json(jobs, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error fetching jobs" },
      { status: 500 }
    );
  }
}

  
