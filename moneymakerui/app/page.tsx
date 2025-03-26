// app/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from '@/components/ui/Button';
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { status } = useSession();

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* Hero Section */}
      <section className="py-20 text-center bg-gradient-to-b from-gray-800 to-gray-900">
        <h1 className="text-5xl font-bold text-white mb-4">Track, Optimize & Grow Your Portfolio</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Easily manage your stock portfolio with real-time tracking and smart, AI-powered suggestions for optimal investing.
        </p>
        {status !== "authenticated" && (
          <div className="mt-6 flex justify-center gap-4">
            <Button variant="primary" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <Image src="/images/realtime-graph.png" alt="Real-time Tracking" width={100} height={100} className="mx-auto mb-4"/>
            <h3 className="text-xl font-semibold">Real-time Stock Tracking</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Stay updated with live prices and portfolio valuation.</p>
          </div>
          <div>
            <Image src="/images/ai-optimization.png" alt="AI Optimization" width={100} height={100} className="mx-auto mb-4"/>
            <h3 className="text-xl font-semibold">AI-powered Optimization</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Our intelligent algorithms suggest portfolio improvements.</p>
          </div>
          <div>
            <Image src="/images/personalized-suggestions.png" alt="Personalized Suggestions" width={100} height={100} className="mx-auto mb-4"/>
            <h3 className="text-xl font-semibold">Personalized Suggestions</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Tailored investment advice based on your unique goals.</p>
          </div>
        </div>
      </section>

      {/* Visual Representation Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Gain Insights with Beautiful Graphs</h2>
          <div className="flex justify-center">
            <Image
              src="/images/portfolio-graph.png"
              alt="Portfolio Performance Graph"
              width={900}
              height={500}
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Boost Your Investments?</h2>
        {status !== "authenticated" ? (
          <Button variant="primary" size="lg" asChild>
            <Link href="/signup">Sign Up Now</Link>
          </Button>
        ) : (
          <Button variant="primary" size="lg" asChild>
            <Link href="/portfolio">Go to Your Portfolio</Link>
          </Button>
        )}
      </section>

    </div>
  );
}
