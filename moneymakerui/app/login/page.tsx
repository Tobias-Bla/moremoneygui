"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ Redirect AFTER rendering, once session is loaded
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-900">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center mb-4 text-white">Login</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="w-full px-4 py-2 mb-4 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Sign in with GitHub
        </button>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full px-4 py-2 mb-4 bg-red-600 text-white rounded hover:bg-red-500"
        >
          Sign in with Google
        </button>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 bg-gray-700 text-white rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 bg-gray-700 text-white rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Sign in with Email
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
  Don&apos;t have an account?{" "}
  <a href="/signup" className="text-blue-500 hover:underline">
    Sign up
  </a>
</p>

      </div>
    </div>
  );
}
