import { NextResponse } from "next/server";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL ?? null;

  return NextResponse.json({
    defined: dbUrl !== null,
    startsWith: dbUrl ? dbUrl.slice(0, 20) : null,
    full: dbUrl,
  });
}
