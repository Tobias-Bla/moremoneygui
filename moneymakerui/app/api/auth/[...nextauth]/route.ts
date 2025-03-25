// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

// Correct Next.js and NextAuth type expectations
export async function GET(req: NextRequest, context: { params: { nextauth: string[] } }) {
  return NextAuth(req, context, authOptions);
}

export async function POST(req: NextRequest, context: { params: { nextauth: string[] } }) {
  return NextAuth(req, context, authOptions);
}
