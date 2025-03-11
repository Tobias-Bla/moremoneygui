"use client"; // ✅ Ensures `useSession()` works

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaChartPie, FaUserAlt, FaBriefcase } from "react-icons/fa";

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession(); // ✅ Now correctly inside Sidebar
  const router = useRouter();

  //async function handleLogout() {
   // await signOut({ redirect: false });
   // router.push("/login");
  //}

  // ✅ Hide sidebar on login and signup
  if (["/login", "/signup"].includes(pathname)) return null;

  return (
    <div className="w-64 h-screen bg-gray-800 p-6 text-white flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-semibold mb-8 text-center">Dashboard</h3>
        <ul className="space-y-4">
          <li>
            <a
              href="/dashboard"
              className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-md transition-colors"
            >
              <FaChartPie className="mr-3 text-xl" />
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="/dashboard/portfolio"
              className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-md transition-colors"
            >
              <FaBriefcase className="mr-3 text-xl" />
              My Portfolio
            </a>
          </li>
          <li>
            <a
              href="/dashboard/profile"
              className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-md transition-colors"
            >
              <FaUserAlt className="mr-3 text-xl" />
              Profile
            </a>
          </li>
        </ul>
      </div>

      {/* ✅ Show user info & logout button if logged in */}
      {session?.user && (
        <div className="mt-auto">
          <div className="mb-4 text-center">
            <p className="text-sm font-light">Logged in as</p>
            <p className="font-semibold">{session.user.name || session.user.email}</p>
          </div>
         
        </div>
      )}
    </div>
  );
};

export default Sidebar;
