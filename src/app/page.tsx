"use client";

import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Video,
  PenTool,
  Zap,
  BarChart3,
  Users,
  Check,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/components/session-provider";

const features = [
  {
    icon: Camera,
    title: "Product Image Factory",
    description:
      "AI generates professional product scene descriptions and image prompts. Upload a white-background photo, get studio-quality scene compositions ready for image generation.",
  },
  {
    icon: Video,
    title: "Video Script Factory",
    description:
      "Create detailed video scripts with scene-by-scene breakdowns, voiceover text, and visual directions for unboxing, demos, and lifestyle content.",
  },
  {
    icon: PenTool,
    title: "Copy Factory",
    description:
      "Generate Amazon listings, Shopify product pages, Etsy descriptions, and social media posts — all optimized for conversion and SEO.",
  },
  {
    icon: Zap,
    title: "One-Click Multichannel",
    description:
      "Input your product once, get content tailored for every platform. Consistent brand voice across Amazon, Shopify, Instagram, and TikTok.",
  },
  {
    icon: BarChart3,
    title: "SEO Optimized",
    description:
      "Every piece of content is optimized for search — Amazon A9 algorithm, Google SEO, and social media discovery algorithms.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Invite your team, share projects, and review AI-generated content before publishing. Keep your brand consistent across all creators.",
  },
];

const plans = [
  {
    name: "Free",
    price: 0,
    credits: 10,
    features: [
      "10 credits / month",
      "Basic copy generation",
      "Single user",
      "Standard templates",
      "Community support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Starter",
    price: 19,
    credits: 100,
    features: [
      "100 credits / month",
      "All content types",
      "Image scene generation",
      "Video script creation",
      "Priority support",
      "Basic analytics",
    ],
    cta: "Start Trial",
    popular: true,
  },
  {
    name: "Pro",
    price: 49,
    credits: 500,
    features: [
      "500 credits / month",
      "Everything in Starter",
      "Advanced AI models",
      "Team collaboration (3 seats)",
      "Brand voice customization",
      "API access",
    ],
    cta: "Start Trial",
    popular: false,
  },
  {
    name: "Business",
    price: 149,
    credits: Infinity,
    features: [
      "Unlimited credits",
      "Everything in Pro",
      "Unlimited team seats",
      "Custom AI model training",
      "Dedicated support",
      "White-label export",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Sparkles className="w-6 h-6 text-primary" />
          SnapFlow
        </Link>
        {isAuthenticated ? "Go to Dashboard" : "Get Started"}
      </header>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" /> AI-Powered Content Factory
        </div>
        <h1 className="max-w-4xl text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
          Turn One Product Into{" "}
          <span className="gradient-hero">A Million Contents</span>
        </h1>
        <p className="max-w-2xl text-lg sm:text-xl text-zinc-600 mb-10 leading-relaxed">
          SnapFlow uses AI to generate product images, video scripts, and
          marketing copy for every channel — Amazon, Shopify, social media, and
          more. Stop hiring freelancers. Start generating.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={isAuthenticated ? "/dashboard" : "/register"}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-xl font-semibold text-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}{" "}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-zinc-700 rounded-xl font-semibold text-lg hover:bg-zinc-100 transition-colors border border-zinc-200"
          >
            See How It Works
          </Link>
        </div>
        <p className="mt-6 text-sm text-zinc-400">
          No credit card required · 10 free credits to start
        </p>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-6 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Everything You Need to Sell More
          </h2>
          <p className="text-zinc-500 text-center max-w-2xl mx-auto mb-16 text-lg">
            From product photos to TikTok scripts, SnapFlow generates
            channel-optimized content that converts browsers into buyers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-zinc-200 hover:border-primary/30 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-zinc-500 text-center max-w-2xl mx-auto mb-16 text-lg">
            Start free, upgrade when you need more. One credit = one piece of
            AI-generated content.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-2xl border-2 ${
                  plan.popular
                    ? "border-primary shadow-xl shadow-primary/10"
                    : "border-zinc-200"
                } bg-white`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-zinc-400">/month</span>
                </div>
                <p className="text-sm text-zinc-500 mb-6">
                  {plan.credits === Infinity
                    ? "Unlimited"
                    : plan.credits.toLocaleString()}{" "}
                  credits
                </p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={isAuthenticated ? "/dashboard" : "/register"}
                  className={`block w-full text-center py-2.5 rounded-xl font-medium transition-colors ${
                    plan.popular
                      ? "bg-primary text-white hover:bg-primary-dark"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-12 border-t border-zinc-200 bg-white mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-400">
          <div className="flex items-center gap-2 font-semibold text-zinc-600">
            <Sparkles className="w-4 h-4 text-primary" />
            SnapFlow
          </div>
          <p>&copy; {new Date().getFullYear()} SnapFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
