"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/auth/login", { email, password });
      
      if (response.data?.success) {
        // Redirect to the dashboard or home page after successful login
        router.push("/dashboard");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div
  className="flex items-center justify-center min-h-screen text-black"
  style={{
    backgroundImage: "url('/images/mm_background.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
    <h1 className="text-3xl font-semibold text-center mb-4 text-white">Login</h1>
    
    {error && <div className="text-red-500 text-center mb-4">{error}</div>}
    
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="mt-1"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          className="mt-1"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-500">Login</Button>
    </form>
  </div>
</div>
  );
}
