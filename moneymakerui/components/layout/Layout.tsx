// components/layout/Layout.tsx
"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const hideSidebar = ["/login", "/signup"].includes(pathname);

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col flex-1">
        {!hideSidebar && <Header />}
        <main className="flex-1 p-6 bg-background text-foreground">
          {children}
        </main>
        <footer className="bg-gray-800 text-white text-center p-4">
          <Link href="/impressum" className="text-blue-400 hover:underline">
            Impressum
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
