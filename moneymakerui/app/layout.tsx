"use client"; // ✅ Required for Client Components

import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/SessionProvider";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header"; // ✅ Import the new header components
import { usePathname } from "next/navigation";
import Link from "next/link"; // ✅ Import Link from Next.js

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = ["/login", "/signup"].includes(pathname);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} flex flex-col min-h-screen bg-gray-100 text-gray-900`}
      >
        <AuthProvider>
          {!hideSidebar && <Header />}
          <div className="flex flex-1">
            {!hideSidebar && <Sidebar />}
            {/* Updated main container to use the light theme */}
            <main className="flex-1 p-6 bg-gray-100">{children}</main>
          </div>
          <footer className="bg-gray-200 text-white-900 text-center p-4">
            <Link href="/impressum" className="text-blue-400 hover:underline">
              Impressum
            </Link>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
