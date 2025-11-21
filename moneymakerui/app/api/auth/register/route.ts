import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: hashedPassword, // <-- wichtig!
      },
    });

    return NextResponse.json({ message: "User created", user: { id: newUser.id, email: newUser.email } }, { status: 201 });

  } catch (error) {
    console.error("❌ Registration Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
