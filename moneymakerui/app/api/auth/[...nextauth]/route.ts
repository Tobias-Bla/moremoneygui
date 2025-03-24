import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { NextAuthOptions, Profile as NextAuthProfile, Account, User } from "next-auth";
import type { AdapterUser } from "next-auth/adapters"; // ✅ Correct import
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

// ✅ Extend Profile type to include GitHub-specific properties
interface ExtendedProfile extends NextAuthProfile {
  id?: string | number;
  avatar_url?: string;
}

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        url: "https://github.com/login/oauth/authorize",
        params: {
          scope: "read:user user:email",
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/github`,
        },
      },
      token: "https://github.com/login/oauth/access_token",
      userinfo: "https://api.github.com/user",
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
        session.user.email = token.email ?? "";
        session.user.image = token.picture ?? "/default-avatar.png";
      }
      return session;
    },
    async jwt({
      token,
      user,
      account,
      profile,
    }: {
      token: JWT;
      user?: User | AdapterUser;
      account?: Account | null;
      profile?: ExtendedProfile;
    }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id;
        token.name = user.name || user.email;
        token.email = user.email;
      }
      if (profile) {
        token.picture = profile.avatar_url || profile.image || "/default-avatar.png"; // ✅ Fix GitHub profile image
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions };
