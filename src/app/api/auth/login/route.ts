import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();


interface CustomSessionData {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

   
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    
    const res = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    
    const session = await getIronSession<CustomSessionData>(
      req,
      res,
      sessionOptions
    );

    
    session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    await session.save();

   
    return res;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
