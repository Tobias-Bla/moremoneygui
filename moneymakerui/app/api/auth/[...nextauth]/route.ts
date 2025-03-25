// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest } from 'next/server';

const handler = NextAuth(authOptions);

// ✅ Correct handling for NextAuth with App Router
export async function GET(req: NextRequest, { params }: { params: { nextauth: string[] } }) {
  return handler(req, { params });
}

export async function POST(req: NextRequest, { params }: { params: { nextauth: string[] } }) {
  return handler(req, { params });
}
