"use client"; // ✅ Required for useSession()

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaChartPie, FaUserAlt, FaBriefcase } from "react-icons/fa";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push("/login");
  }

  return (
    <header className="bg-gray-800 text-white flex justify-between items-center p-4 shadow-md">
      {/* Left: Logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="MoreMoney Logo"
            width={191}
            height={20}
            priority
          />
        </Link>
      </div>

      {/* Middle: Navigation Menu */}
      <nav className="flex space-x-4">
        <Link
          href="/dashboard"
          className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-md transition-colors"
        >
          <FaChartPie className="mr-2 text-xl" />
          Dashboard
        </Link>
        <Link
          href="/dashboard/portfolio"
          className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-md transition-colors"
        >
          <FaBriefcase className="mr-2 text-xl" />
          My Portfolio
        </Link>
        <Link
          href="/profile"
          className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-md transition-colors"
        >
          <FaUserAlt className="mr-2 text-xl" />
          Profile
        </Link>
        <Link
          href="/market-trends"
          className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-md transition-colors"
        >
          <FaUserAlt className="mr-2 text-xl" />
          Market Trends
        </Link>
        <Link
          href="/about"
          className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-md transition-colors"
        >
          <FaUserAlt className="mr-2 text-xl" />
          About Us
        </Link>
      </nav>

      {/* Right: User Info / Logout or Sign Up */}
      <div className="flex items-center">
        {mounted && session?.user ? (
          <>
            <span className="mr-3">
              Welcome, {session.user.name || "User"}
            </span>
            <Image
              src={session.user.image || "/default-avatar.png"}
              alt="User Avatar"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition"
          >
            Sign Up
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
