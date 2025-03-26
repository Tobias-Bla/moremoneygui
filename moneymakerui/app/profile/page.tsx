"use client";

import { useSession, signOut } from "next-auth/react";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

const ProfilePage: React.FC = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<
    "profile" | "account" | "preferences"
  >("profile");

  // Handlers (change password, avatar, delete account, etc.)
  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Change password logic
  };

  const handleAvatarChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Change avatar logic
  };

  const handleDeleteAccount = () => {
    if (
      confirm("Are you sure you want to delete your account? This cannot be undone.")
    ) {
      // Delete account logic
    }
  };

  const handlePreferencesUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Update preferences logic
  };

  if (!session) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background text-foreground">
        <p className="text-xl">
          You must be logged in to view the profile page.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto w-full p-6">
        <div className="bg-card text-card-foreground p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center mb-6">User Profile</h2>

          {/* Tabs */}
          <div className="flex justify-center mb-6 space-x-2">
            <Button
              variant={activeTab === "profile" ? "primary" : "secondary"}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </Button>
            <Button
              variant={activeTab === "account" ? "primary" : "secondary"}
              onClick={() => setActiveTab("account")}
            >
              Account Settings
            </Button>
            <Button
              variant={activeTab === "preferences" ? "primary" : "secondary"}
              onClick={() => setActiveTab("preferences")}
            >
              Preferences
            </Button>
          </div>

          {/* Tab Content */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-32 h-32">
                  <img
                    src={session.user?.image || "/default-avatar.png"}
                    alt="User Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{session.user?.name}</h3>
                  <p>{session.user?.email}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-8">
              {/* Change Password */}
              <div>
                <h4 className="text-xl font-bold mb-2">Change Password</h4>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full p-2 border rounded bg-input text-foreground"
                    required
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full p-2 border rounded bg-input text-foreground"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full p-2 border rounded bg-input text-foreground"
                    required
                  />
                  <Button type="submit" variant="primary">
                    Update Password
                  </Button>
                </form>
              </div>

              {/* Change Avatar */}
              <div>
                <h4 className="text-xl font-bold mb-2">Change Avatar</h4>
                <form onSubmit={handleAvatarChange} className="space-y-4">
                  <input type="file" accept="image/*" className="w-full text-foreground" required />
                  <Button type="submit" variant="primary">
                    Update Avatar
                  </Button>
                </form>
              </div>

              {/* Delete Account */}
              <div>
                <h4 className="text-xl font-bold mb-2">Delete Account</h4>
                <Button onClick={handleDeleteAccount} variant="danger">
                  Delete Account
                </Button>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6">
              <h4 className="text-xl font-bold mb-2">
                Portfolio Optimization Preferences
              </h4>
              <form onSubmit={handlePreferencesUpdate} className="space-y-4">
                <div>
                  <label className="block">Risk Tolerance</label>
                  <select className="w-full p-2 border rounded bg-input text-foreground">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block">
                    Investment Horizon (Years)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded bg-input text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block">
                    Preferred Sectors
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Technology, Healthcare"
                    className="w-full p-2 border rounded bg-input text-foreground"
                  />
                </div>
                <Button type="submit" variant="primary">
                  Save Preferences
                </Button>
              </form>
            </div>
          )}

          {/* Sign Out */}
          <div className="flex justify-center mt-8">
            <Button onClick={() => signOut()} variant="secondary">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
