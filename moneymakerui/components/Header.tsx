"use client"; // ✅ Required for useSession()

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter(); // ✅ Use router for redirection

  async function handleLogout() {
    await signOut({ redirect: false }); // ✅ Prevents default NextAuth redirection
    router.push("/login"); // ✅ Manually redirect to login page
  }

  return (
    <header className="bg-gray-800 text-white flex justify-between items-center p-4 shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <Image src="/images/logo.png" alt="MoreMoney Logo" width={111} height={10} />
      </div>

      {/* Profile & Logout */}
      {session?.user && (
        <div className="flex items-center">
          <span className="mr-3">Welcome, {session.user.name || "User"}</span>
          import Image from "next/image";

<Image
  src={session?.user?.image || "/default-avatar.png"}
  alt="User Avatar"
  width={32} // ✅ Specify width
  height={32} // ✅ Specify height
  className="w-8 h-8 rounded-full"
/>

          <button
            onClick={handleLogout} // ✅ Use modified logout function
            className="ml-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
