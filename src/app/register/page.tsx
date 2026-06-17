"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";

// Simple demo register — always succeeds
export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate registration delay
    await new Promise((r) => setTimeout(r, 800));

    // Store demo user
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
      {/* Left: Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary via-violet-500 to-pink-500 items-center justify-center p-12">
        <div className="text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Start Creating</h2>
          <p className="text-xl text-white/80 leading-relaxed max-w-md">
            Join thousands of e-commerce sellers using AI to scale their content
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl mb-8">
            <Sparkles className="w-6 h-6 text-primary" />
            SnapFlow
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-zinc-500 mb-8">10 free credits to get started</p>

          {error && (
            <div className="p-3 mb-6 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                placeholder="Your name"
              />
            </div>
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
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                placeholder="8+ characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
