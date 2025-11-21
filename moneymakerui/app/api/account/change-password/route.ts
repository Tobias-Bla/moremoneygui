// app/api/account/change-password/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";                       // <-- zentrale Instanz
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  // 1. Session prüfen
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { message: "Not authenticated" },
      { status: 401 }
    );
  }

  // 2. Body lesen
  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { message: "Missing fields" },
      { status: 400 }
    );
  }

  try {
    // 3. User aus DB holen
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // 4. Passwort prüfen – WICHTIG: passwordHash
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // 5. Neues Passwort hashen
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 6. DB update – WICHTIG: passwordHash setzen
    await prisma.user.update({
      where: { email: user.email },
      data: { passwordHash: hashedPassword },
    });

    return NextResponse.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("Change Password Error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
