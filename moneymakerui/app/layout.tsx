// app/layout.tsx
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/SessionProvider";
import Providers from "@/components/providers";
import Layout from "@/components/layout/Layout";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.className}`}>
        <AuthProvider>
          <Providers> {/* next-themes Provider wrapper */}
            <Layout>
              {children}
            </Layout>
            <Toaster position="top-center" richColors closeButton />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
