import NextAuth, { Session, User } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { JWT } from "next-auth/jwt"; // Import JWT from next-auth/jwt

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      // Ensure the user image is included in the session
      if (typeof token.image === "string") {
        session.user.image = token.image;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.image) {
        token.image = user.image;
      }
      return token;
    },
  },
  // Add other NextAuth.js configurations here as needed
});

export { handler as GET, handler as POST };
