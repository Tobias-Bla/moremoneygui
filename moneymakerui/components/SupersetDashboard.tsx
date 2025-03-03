"use client";

import React, { useEffect, useState } from "react";
import { loginToSuperset } from "@/utils/supersetAuth";

const SupersetDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // If you're using token-based embedding, you could append the token to the URL.
  // For a simple login via session cookies, just use the dashboard URL directly.
  const dashboardUrl = "http://localhost:8088/superset/dashboard/p/7XE6Y70Pwal/";

  useEffect(() => {
    const authenticate = async () => {
      const success = await loginToSuperset();
      setIsLoggedIn(success);
    };
    authenticate();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Superset Dashboard</h1>
      {isLoggedIn ? (
        <iframe
          src={dashboardUrl}
          width="100%"
          height="800px"
          style={{ border: "none" }}
        />
      ) : (
        <p className="text-center text-red-500">🔒 Logging into Superset...</p>
      )}
    </div>
  );
};

export default SupersetDashboard;
