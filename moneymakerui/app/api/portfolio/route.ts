// app/api/portfolio/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// -------------------------------
// GET: Portfolio abrufen
// -------------------------------
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const stocks = await prisma.userStock.findMany({
      where: { userId: user.id },
    });

    return NextResponse.json(stocks, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Unable to fetch stocks" },
      { status: 500 }
    );
  }
}

// -------------------------------
// POST: Aktie hinzufügen / erhöhen
// -------------------------------
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const { symbol, quantity } = await req.json();

    if (!symbol || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Valid stock symbol and quantity are required" },
        { status: 400 }
      );
    }

    // 1️⃣ User holen
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Upsert via (userId, symbol)
    const stock = await prisma.userStock.upsert({
      where: {
        user_symbol: {
          userId: user.id,
          symbol,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId: user.id,
        symbol,
        quantity,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        symbol: stock.symbol,
        quantity: stock.quantity,
        createdAt: stock.createdAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// -------------------------------
// DELETE: Aktie entfernen
// -------------------------------
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const { symbol } = await req.json();

    if (!symbol) {
      return NextResponse.json(
        { error: "Stock symbol is required" },
        { status: 400 }
      );
    }

    // 1️⃣ User holen
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Delete via userId
    await prisma.userStock.deleteMany({
      where: {
        userId: user.id,
        symbol,
      },
    });

    return NextResponse.json(
      { message: "Stock removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Unable to remove stock" },
      { status: 500 }
    );
  }
}
