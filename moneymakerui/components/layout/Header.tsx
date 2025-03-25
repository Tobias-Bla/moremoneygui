"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/Button';



const Header = () => {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleLogout() {
    await signOut({ redirect: false });
  }

  return (
    <header className="bg-gray-800 text-white flex justify-between items-center p-4 shadow-md">
      {/* Left: Logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={191}
            height={20}
            priority
          />
        </Link>
      </div>

      {/* Center: Navigation Menu */}
      <nav className="hidden md:flex space-x-4">
        <Link href="/dashboard" className="hover:text-gray-300">
          Dashboard
        </Link>
        <Link href="/portfolio" className="hover:text-gray-300">
          Portfolio
        </Link>
        <Link href="/profile" className="hover:text-gray-300">
          Profile
        </Link>
        <Link href="/market-trends" className="hover:text-gray-300">
          Market Trends
        </Link>
        <Link href="/about" className="hover:text-gray-300">
          About Us
        </Link>
      </nav>

      {/* Right: Authentication Actions */}
      <div className="flex items-center space-x-2">
        {mounted && session?.user ? (
          <>
            <span className="hidden md:inline mr-3">
              Welcome, {session.user.name || "User"}
            </span>
            <Image
              src={session.user.image || "/default-avatar.png"}
              alt="User Avatar"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="primary">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button variant="secondary">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
