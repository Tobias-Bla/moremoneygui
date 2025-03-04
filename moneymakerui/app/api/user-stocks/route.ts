import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
  // _req is intentionally not used.
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  try {
    const stocks = await prisma.userStock.findMany({
      where: { email: session.user.email },
    });

    return NextResponse.json(stocks);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return NextResponse.json({ error: "Unable to fetch stocks" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  const { symbol } = await req.json();

  if (!symbol) {
    return NextResponse.json({ error: "Stock symbol is required" }, { status: 400 });
  }

  try {
    // Use findFirst instead of findUnique because StockPrice has a composite key.
    const stockExists = await prisma.stockPrice.findFirst({
      where: { symbol },
      orderBy: { timestamp: 'desc' }, // Optionally get the most recent record
    });

    if (!stockExists) {
      return NextResponse.json({ error: "Symbol does not exist" }, { status: 400 });
    }

    const stock = await prisma.userStock.create({
      data: {
        email: session.user.email,
        symbol,
        price: stockExists.price.toNumber(), // Convert Decimal to number
        timestamp: new Date().toISOString(),
      },
    });
    
    return NextResponse.json(stock);
  } catch (error) {
    console.error("Error adding stock:", error);
    return NextResponse.json({ error: "Unable to add stock" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  const { symbol } = await req.json();

  if (!symbol) {
    return NextResponse.json({ error: "Stock symbol is required" }, { status: 400 });
  }

  try {
    await prisma.userStock.deleteMany({
      where: {
        email: session.user.email,
        symbol,
      },
    });

    return NextResponse.json({ message: "Stock removed successfully" });
  } catch (error) {
    console.error("Error removing stock:", error);
    return NextResponse.json({ error: "Unable to remove stock" }, { status: 500 });
  }
}
