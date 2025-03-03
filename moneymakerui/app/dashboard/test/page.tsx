"use client";

import React, { useState } from "react";

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  // When a user logs in, the session cookie will be stored in the browser.
  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch("http://192.168.2.56:8088/api/v1/security/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          provider: "db",
        }),
        credentials: "include", // Ensure cookies are sent/received
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }
      setIsLoggedIn(true);
      setLoginError("");
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setLoginError(errorMessage);
      console.error("Login error:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div>
        <h1>Login to Superset</h1>
        {loginError && <p style={{ color: "red" }}>{loginError}</p>}
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  // Once logged in, embed the dashboard using an iframe.
  return (
    <div>
      <h1>Dashboard</h1>
      <iframe
        src="http://192.168.2.56:8088/superset/dashboard/ca5fc5a5-d733-44c9-9b35-f71b3a09c37c/"
        style={{ width: "100%", minHeight: "800px", border: "none" }}
      ></iframe>
    </div>
  );
}

function LoginForm({ onLogin }: { onLogin: (username: string, password: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Username:{" "}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Password:{" "}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
