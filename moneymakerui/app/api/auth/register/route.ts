// app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  // You can add validation logic here (e.g., check if the user already exists)

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // In a real application, you should hash the password before storing it!
      },
    });

    return NextResponse.json({ message: "User created successfully", user: newUser });
  } catch (error: any) {
    // Type error as any to prevent TypeScript error
    return NextResponse.json({ message: "Error creating user", error: error.message }, { status: 500 });
  }
}
