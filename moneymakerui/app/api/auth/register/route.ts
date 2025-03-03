// app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: Request) {
  // Explicitly type the expected request body
  const { name, email, password } = (await req.json()) as RegisterRequest;

  // You can add validation logic here (e.g., check if the user already exists)

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // In a real application, hash the password before storing it!
      },
    });

    return NextResponse.json({ message: "User created successfully", user: newUser });
  } catch (error: unknown) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ message: "Error creating user", error: errorMessage }, { status: 500 });
  }
}
