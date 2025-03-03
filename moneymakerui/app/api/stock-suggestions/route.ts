import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query || query.trim() === "") {
      return NextResponse.json([]); // Return empty array if no query provided
    }

    console.log("Received query:", query); // Debugging

    const stocks = await prisma.stockPrice.findMany({
      where: {
        symbol: {
          startsWith: query.toUpperCase(), // Convert query to uppercase
        },
      },
      take: 10, // Limit results
      select: { symbol: true },
    });

    console.log("Stocks found:", stocks); // Debugging

    return NextResponse.json(stocks);
  } catch (error) {
    console.error("Error fetching stock suggestions:", error);
    return NextResponse.json({ error: "Unable to fetch stock suggestions" }, { status: 500 });
  }
}
