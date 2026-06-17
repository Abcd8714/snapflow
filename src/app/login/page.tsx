"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";

// Simple demo login — always succeeds, stores user in localStorage
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate login delay
    await new Promise((r) => setTimeout(r, 800));

    // Always succeed — store demo user
    localStorage.setItem(
      "snapflow_user",
      JSON.stringify({ plan: "free", creditsRemaining: 10 })
    );

    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl mb-8">
            <Sparkles className="w-6 h-6 text-primary" />
            SnapFlow
          </Link>
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-zinc-500 mb-8">Sign in to your SnapFlow account</p>

          {error && (
            <div className="p-3 mb-6 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary via-violet-500 to-pink-500 items-center justify-center p-12">
        <div className="text-white text-center">
          <h2 className="text-4xl font-bold mb-4">SnapFlow</h2>
          <p className="text-xl text-white/80 leading-relaxed max-w-md">
            Your AI-powered e-commerce content factory. Generate, publish, sell.
          </p>
        </div>
      </div>
    </div>
  );
}
