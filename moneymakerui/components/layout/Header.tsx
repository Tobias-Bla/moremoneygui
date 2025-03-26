// components/layout/Header.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/Button';
import { useRouter } from "next/navigation";
import ThemeSwitcher from "@/components/layout/ThemeSwitcher";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <header className="bg-gray-800 text-white flex justify-between items-center px-6 py-4 shadow-md">
      {/* Left: Logo */}
      <Link href="/">
        <Image src="/images/logo.svg" alt="Logo" width={191} height={20} priority />
      </Link>

      {/* Center: Navigation (only if authenticated) */}
      {mounted && status === "authenticated" && (
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link href="/portfolio" className="hover:text-gray-300">Portfolio</Link>
          <Link href="/profile" className="hover:text-gray-300">Profile</Link>
          <Link href="/market-trends" className="hover:text-gray-300">Market Trends</Link>
          <Link href="/about" className="hover:text-gray-300">About Us</Link>
        </nav>
      )}

      {/* Right: Authentication and ThemeSwitcher */}
      <div className="flex items-center space-x-3">
        {mounted ? (
          session?.user ? (
            <>
              <span className="hidden md:inline">Welcome, {session.user.name || "User"}</span>
              <Avatar>
                <AvatarImage src={session.user.image || "/default-avatar.png"} />
                <AvatarFallback>{(session.user.name || "U")[0]}</AvatarFallback>
              </Avatar>
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )
        ) : null}

        <ThemeSwitcher /> {/* Theme switching button */}
      </div>
    </header>
  );
}
