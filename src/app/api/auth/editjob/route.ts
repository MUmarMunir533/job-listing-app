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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Job id is required" },
        { status: 400 }
      );
    }

    const session = await getIronSession<CustomSessionData>(
      await cookies(),
      sessionOptions
    );
    if (!session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobId = parseInt(id, 10);
    if (isNaN(jobId)) {
      return NextResponse.json({ error: "Invalid job id" }, { status: 400 });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error fetching job" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Job id is required" },
        { status: 400 }
      );
    }

    const session = await getIronSession<CustomSessionData>(
      await cookies(),
      sessionOptions
    );
    if (!session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobId = parseInt(id, 10);
    if (isNaN(jobId)) {
      return NextResponse.json({ error: "Invalid job id" }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = jobSchema.parse(body);

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        location: validatedData.location,
        salary: validatedData.salary,
      },
    });

    return NextResponse.json(updatedJob, { status: 200 });
  } catch (error: any) {
    const statusCode = error instanceof z.ZodError ? 400 : 500;
    return NextResponse.json(
      { error: error.message || "Error updating job" },
      { status: statusCode }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getIronSession<CustomSessionData>(
      await cookies(),
      sessionOptions
    );
    if (!session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    if (!idParam) {
      return NextResponse.json(
        { error: "Job id is required" },
        { status: 400 }
      );
    }
    const jobId = parseInt(idParam, 10);
    if (isNaN(jobId)) {
      return NextResponse.json({ error: "Invalid job id" }, { status: 400 });
    }

    const existingJob = await prisma.job.findUnique({ where: { id: jobId } });
    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const deletedJob = await prisma.job.delete({ where: { id: jobId } });
    return NextResponse.json(deletedJob, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error deleting job" },
      { status: 500 }
    );
  }
}
