import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { avatarUrl } = await req.json();
  if (!avatarUrl) {
    return NextResponse.json({ message: "Missing avatarUrl" }, { status: 400 });
  }

  try {
    // Update the user's avatar (assumes user model has an "image" field)
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { image: avatarUrl },
    });

    return NextResponse.json({ message: "Avatar updated successfully", user: updatedUser });
  } catch (error: any) {
    console.error("Change Avatar Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
