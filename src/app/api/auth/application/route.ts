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

const applicationStatusSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
});

export async function GET(request: Request) {
  try {
    const session = await getIronSession<CustomSessionData>(
      await cookies(),
      sessionOptions
    );
    if (!session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const applicationId = parseInt(id, 10);
      if (isNaN(applicationId)) {
        return NextResponse.json(
          { error: "Invalid application id" },
          { status: 400 }
        );
      }
      const application = await prisma.application.findUnique({
        where: { id: applicationId },
      });
      if (!application) {
        return NextResponse.json(
          { error: "Application not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(application, { status: 200 });
    } else {
      const applications = await prisma.application.findMany();
      return NextResponse.json(applications, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error fetching applications" },
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
        { error: "Application id is required" },
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

    const applicationId = parseInt(id, 10);
    if (isNaN(applicationId)) {
      return NextResponse.json(
        { error: "Invalid application id" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = applicationStatusSchema.parse(body);

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: validatedData.status,
      },
    });

    return NextResponse.json(updatedApplication, { status: 200 });
  } catch (error: any) {
    const statusCode = error instanceof z.ZodError ? 400 : 500;
    return NextResponse.json(
      { error: error.message || "Error updating application" },
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
        { error: "Application id is required" },
        { status: 400 }
      );
    }

    const applicationId = parseInt(idParam, 10);
    if (isNaN(applicationId)) {
      return NextResponse.json(
        { error: "Invalid application id" },
        { status: 400 }
      );
    }

    const existingApplication = await prisma.application.findUnique({
      where: { id: applicationId },
    });
    if (!existingApplication) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const deletedApplication = await prisma.application.delete({
      where: { id: applicationId },
    });
    return NextResponse.json(deletedApplication, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error deleting application" },
      { status: 500 }
    );
  }
}
