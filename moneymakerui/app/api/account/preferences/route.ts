// app/api/account/preferences/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });
    return NextResponse.json(preferences);
  } catch (error: unknown) {
    console.error("Get Preferences Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

interface PreferencesBody {
  riskTolerance: string;
  investmentHorizon?: number | string | null;
  preferredSectors: string;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  // Explicitly type the parsed JSON as PreferencesBody.
  const body = (await req.json()) as PreferencesBody;
  const { riskTolerance, investmentHorizon, preferredSectors } = body;

  try {
    const existing = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });

    if (existing) {
      const updated = await prisma.userPreferences.update({
        where: { userId: session.user.id },
        data: {
          riskTolerance,
          investmentHorizon: investmentHorizon ? Number(investmentHorizon) : null,
          preferredSectors,
        },
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.userPreferences.create({
        data: {
          userId: session.user.id,
          riskTolerance,
          investmentHorizon: investmentHorizon ? Number(investmentHorizon) : null,
          preferredSectors,
        },
      });
      return NextResponse.json(created);
    }
  } catch (error: unknown) {
    console.error("Preferences Update Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
