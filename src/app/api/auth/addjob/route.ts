import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface CustomSessionData {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  salary: z
    .number({ invalid_type_error: "Salary must be a number" })
    .positive("Salary must be positive"),
});

export async function POST(request: Request) {
  try {
    const session = await getIronSession<CustomSessionData>(
      await cookies(),
      sessionOptions
    );

    if (!session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = jobSchema.parse(body);

    const newJob = await prisma.job.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        location: validatedData.location,
        salary: validatedData.salary,
        postedById: session.user.id,
      },
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error: any) {
    const statusCode = error instanceof z.ZodError ? 400 : 500;
    return NextResponse.json(
      { error: error.message || "Error creating job" },
      { status: statusCode }
    );
  }
}
