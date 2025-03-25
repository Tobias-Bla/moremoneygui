// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import type { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { nextauth: string[] } }
) => {
  return NextAuth(req, { params }, authOptions);
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { nextauth: string[] } }
) => {
  return NextAuth(req, { params }, authOptions);
};
