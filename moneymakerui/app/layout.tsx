import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getAuthSession } from "@/lib/auth"; // Fetch session
import AuthProvider from "@/components/SessionProvider"; // Import the new provider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MoreMoney",
  description: "Your stock market dashboard",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("Fetching session..."); // Debugging
  const session = await getAuthSession();
  console.log("Session:", session); // Debugging

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Wrap in AuthProvider instead of directly using SessionProvider */}
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
