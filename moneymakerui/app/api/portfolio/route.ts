import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function GET(_req: NextRequest) {
  const session = await getServerSession();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }
  try {
    const stocks = await prisma.userStock.findMany({
      where: { email },
    });
    return NextResponse.json(stocks);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Unable to fetch stocks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }
  try {
    const { symbol, quantity } = await req.json();
    if (!symbol || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Valid stock symbol and quantity are required" },
        { status: 400 }
      );
    }
    const stock = await prisma.userStock.upsert({
      where: { email_symbol: { email, symbol } },
      update: { quantity: { increment: quantity } },
      create: { email, symbol, quantity, createdAt: new Date() },
    });
    return NextResponse.json({
      symbol: stock.symbol,
      quantity: stock.quantity,
      createdAt: stock.createdAt,
    });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }
  try {
    const { symbol } = await req.json();
    if (!symbol) {
      return NextResponse.json({ error: "Stock symbol is required" }, { status: 400 });
    }
    await prisma.userStock.deleteMany({
      where: { email, symbol },
    });
    return NextResponse.json({ message: "Stock removed successfully" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Unable to remove stock" }, { status: 500 });
  }
}
