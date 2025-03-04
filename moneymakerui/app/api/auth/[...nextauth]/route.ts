import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/github`,
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize called with:", credentials);

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) {
          throw new Error("No user found with this email.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password.");
        }

        console.log("User authenticated:", user);
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.name = token.name ?? session.user.email ?? "User"; 
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

// ✅ Correctly export GET & POST handlers
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
