// @/lib/auth.ts
import type {
  NextAuthOptions,
  User,
  Account,
  Profile as NextAuthProfile,
  Session,
} from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { AdapterUser } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";

// ⬇️ WICHTIG: zentralen Prisma-Client verwenden
import prisma from "@/lib/prisma";

interface ExtendedProfile extends NextAuthProfile {
  avatar_url?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with this email.");
        }

        // ⬇️ WICHTIG: passwordHash statt password
        const passwordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );

        if (!passwordValid) {
          throw new Error("Invalid password.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET!,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      // Achtung: dein Session-Typ muss user.id erlauben (notfalls any casten)
      (session.user as any).id = token.sub!;
      session.user.name = token.name || token.email!;
      session.user.email = token.email!;
      session.user.image = token.picture || "/default-avatar.png";
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
      if (account?.access_token) {
        (token as any).accessToken = account.access_token;
      }

      if (user) {
        token.sub = user.id;
        token.name = user.name!;
        token.email = user.email!;
        token.picture = user.image || "/default-avatar.png";
      }

      if (profile?.avatar_url) {
        token.picture = profile.avatar_url;
      }

      return token;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
};
