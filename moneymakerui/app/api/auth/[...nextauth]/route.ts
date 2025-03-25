// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import type { NextRequest } from "next/server";

const handler = NextAuth(authOptions);

export const GET = (req: NextRequest) => handler(req);
export const POST = (req: NextRequest) => handler(req);
