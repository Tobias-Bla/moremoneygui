// app/api/stock_prices/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const prices = await prisma.stockPrice.findMany();
    return NextResponse.json(prices);
  } catch (error) {
    console.error("Error fetching stock prices:", error);
    return NextResponse.json({ error: "Error fetching stock prices" }, { status: 500 });
  }
}
