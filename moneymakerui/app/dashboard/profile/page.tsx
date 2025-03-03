"use client";

import { useSession, signOut } from "next-auth/react"; // Import next-auth to handle session
import React from "react";

const ProfilePage: React.FC = () => {
  const { data: session } = useSession(); // Get session data (user info)

  if (!session) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-xl text-gray-600">You must be logged in to view the profile page.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center mb-6">User Profile</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-32 h-32">
                <img
                  src={session?.user?.image || "/default-avatar.png"} // Fallback if image doesn't exist
                  alt="User Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{session?.user?.name}</h3>
                <p className="text-gray-500">{session?.user?.email}</p>
              </div>
            </div>

            {/* Display more user info here if available */}
            <div>
              <h4 className="font-semibold text-lg mt-4">User Info</h4>
              <div className="space-y-2">
                <p><strong>Name:</strong> {session?.user?.name}</p>
                <p><strong>Email:</strong> {session?.user?.email}</p>
                <p><strong>Username:</strong> {session?.user?.name}</p> {/* Adjust if you have a username field */}
                {/* You can add other fields here depending on what user information is available */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Footer */}
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>Hello World</p>
      </footer>
    </div>
  );
};

export default ProfilePage;
