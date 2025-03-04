"use client"; // ✅ Required for Client Components

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/SessionProvider";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header"; // ✅ Import the new header components
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = ["/login", "/signup"].includes(pathname);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen`}>
        <AuthProvider>
          {!hideSidebar && <Header />} {/* ✅ Move useSession() inside Header */}
          <div className="flex flex-1">
            {!hideSidebar && <Sidebar />}
            <main className="flex-1 p-6 bg-gray-100">{children}</main>
          </div>
          <footer className="bg-gray-800 text-white text-center p-4">
            <p>Hello World</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );

}
