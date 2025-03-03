"use client";

import React from "react";
import Sidebar from "../../components/sidebar";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Global Header */}
      <header className="bg-gray-800 text-white flex justify-between items-center p-4 shadow-md">
        {/* Logo */}
        <div className="flex items-center">
          <Image src="/images/logo.png" alt="MoreMoney Logo" width={111} height={10} />
        </div>

        {/* Profile & Logout */}
        <div className="flex items-center">
          <span className="mr-3">Welcome, {session?.user?.name}</span>
          <img
            src={session?.user?.image || "/default-avatar.png"}
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
          <button
            onClick={() => signOut()}
            className="ml-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Layout with Sidebar and Main Content */}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>

      {/* Global Footer */}
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>Hello World</p>
      </footer>
    </div>
  );
};

export default DashboardLayout;
