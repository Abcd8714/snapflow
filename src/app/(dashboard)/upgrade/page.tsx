"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  ArrowLeft,
  Sparkles,
  Crown,
  Zap,
  Infinity,
  Copy,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/components/session-provider";
import { toast } from "sonner";

const plans = [
  {
    key: "starter",
    name: "Starter",
    price: "¥29",
    priceUSD: "$5",
    period: "month",
    credits: 100,
    icon: Zap,
    color: "bg-blue-500",
    features: [
      "100 credits / month",
      "All content types (image, video, copy)",
      "Image scene generation",
      "Video script creation",
      "Email support",
      "Basic analytics",
    ],
    popular: false,
  },
  {
    key: "pro",
    name: "Pro",
    price: "¥69",
    priceUSD: "$10",
    period: "month",
    credits: 500,
    icon: Crown,
    color: "bg-violet-500",
    features: [
      "500 credits / month",
      "Everything in Starter",
      "Custom AI models (brand voice)",
      "Team collaboration (3 seats)",
      "Priority support",
      "API access",
    ],
    popular: true,
  },
  {
    key: "business",
    name: "Business",
    price: "¥199",
    priceUSD: "$29",
    period: "month",
    credits: Infinity,
    icon: Infinity,
    color: "bg-amber-500",
    features: [
      "Unlimited credits",
      "Everything in Pro",
      "Unlimited team seats",
      "Custom AI model training",
      "Dedicated account manager",
      "White-label export",
    ],
    popular: false,
  },
];

export default function UpgradePage() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const wechatQR = "https://placehold.co/300x300/07C160/white?text=WeChat+Pay+QR";
  const alipayQR = "https://placehold.co/300x300/1677FF/white?text=Alipay+QR";

  function handleSelectPlan(key: string) {
    setSelectedPlan(key);
  }

  function handleCopyCode() {
    navigator.clipboard.writeText("SNAPFLOW-UPGRADE-2026");
    toast.success("Activation code copied! Paste it in Settings → Upgrade.");
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-6">
            <Crown className="w-4 h-4" /> Upgrade Your Plan
          </div>
          <h1 className="text-4xl font-bold mb-4">Scale Your Content Factory</h1>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
            More credits, more features, more growth. Upgrade anytime, cancel anytime.
          </p>
        </div>

        {/* Current usage */}
        <div className="max-w-md mx-auto mb-12 p-4 rounded-2xl bg-white border border-zinc-200 text-center">
          <p className="text-sm text-zinc-500 mb-1">Your Current Plan</p>
          <p className="text-2xl font-bold capitalize">{user?.plan || "Free"}</p>
          <p className="text-sm text-zinc-400 mt-1">
            {user?.creditsRemaining ?? 0} credits remaining
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.key;
            const isCurrent = (user?.plan || "free") === plan.key;

            return (
              <button
                key={plan.key}
                onClick={() => handleSelectPlan(plan.key)}
                className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                  isSelected || plan.popular
                    ? "border-primary shadow-xl shadow-primary/10"
                    : "border-zinc-200 hover:border-zinc-300"
                } bg-white`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 right-3 px-4 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                    Current
                  </div>
                )}

                <div className={`w-10 h-10 rounded-xl ${plan.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                <div className="mb-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-zinc-400 text-sm">/{plan.period}</span>
                </div>
                <p className="text-xs text-zinc-400 mb-4">{plan.priceUSD}/month</p>
                <p className="text-sm text-zinc-500 mb-4">
                  {plan.credits === Infinity ? "Unlimited" : plan.credits.toLocaleString()} credits
                </p>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-600">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div
                  className={`block w-full text-center py-2.5 rounded-xl font-medium transition-colors ${
                    isSelected
                      ? "bg-primary text-white"
                      : isCurrent
                        ? "bg-zinc-100 text-zinc-400 cursor-default"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {isCurrent ? "Current Plan" : "Choose " + plan.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Payment section */}
        {selectedPlan && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="p-6 rounded-2xl bg-white border-2 border-primary shadow-xl shadow-primary/10">
              <h2 className="text-xl font-bold mb-1">Complete Your Upgrade</h2>
              <p className="text-zinc-500 mb-6">
                You selected the{" "}
                <span className="font-semibold text-primary capitalize">{selectedPlan}</span> plan.
                Complete payment to activate.
              </p>

              {/* QR codes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="text-center p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                  <p className="font-medium mb-3 text-sm">WeChat Pay</p>
                  <div className="w-48 h-48 mx-auto bg-white rounded-xl border-2 border-emerald-200 flex items-center justify-center overflow-hidden">
                    {/* 替换为你的微信收款码图片 */}
                    <img
                      src="/wechat-qr.png"
                      alt="WeChat Pay QR Code"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="text-center p-4"><div class="text-4xl mb-2">💚</div><p class="text-sm font-medium text-emerald-700">WeChat QR</p><p class="text-xs text-emerald-500 mt-1">扫码支付<br/>截图联系客服</p></div>';
                      }}
                    />
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">Open WeChat → Scan → Pay</p>
                </div>

                <div className="text-center p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                  <p className="font-medium mb-3 text-sm">Alipay</p>
                  <div className="w-48 h-48 mx-auto bg-white rounded-xl border-2 border-blue-200 flex items-center justify-center overflow-hidden">
                    {/* 替换为你的支付宝收款码图片 */}
                    <img
                      src="/alipay-qr.png"
                      alt="Alipay QR Code"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="text-center p-4"><div class="text-4xl mb-2">💙</div><p class="text-sm font-medium text-blue-700">Alipay QR</p><p class="text-xs text-blue-500 mt-1">扫码支付<br/>截图联系客服</p></div>';
                      }}
                    />
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">Open Alipay → Scan → Pay</p>
                </div>
              </div>
              </div>

              {/* Activation code + instructions */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-4">
                <p className="font-semibold text-amber-800 mb-2">📋 How to activate (3 steps):</p>
                <ol className="text-sm text-amber-700 space-y-1.5">
                  <li>1. Scan the QR code above with WeChat or Alipay</li>
                  <li>
                    2. Pay{" "}
                    <span className="font-bold">
                      {plans.find((p) => p.key === selectedPlan)?.price}
                    </span>{" "}
                    and screenshot the confirmation
                  </li>
                  <li>
                    3. Send the screenshot to our support email:{" "}
                    <span className="font-bold">support@snapflow.cn</span>
                  </li>
                </ol>
              </div>

              {/* Copy activation code */}
              <button
                onClick={handleCopyCode}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy Activation Request Code
              </button>
              <p className="text-xs text-zinc-400 text-center mt-2">
                We'll activate your plan within 2 hours after payment confirmation
              </p>
            </div>
        )}

        {/* Self-service activation */}
        <div className="max-w-md mx-auto p-6 rounded-2xl bg-white border border-zinc-200">
          <h3 className="font-semibold text-lg mb-2">Already Paid?</h3>
          <p className="text-sm text-zinc-500 mb-4">
            Enter the activation code we sent to your email after payment confirmation.
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter activation code..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-mono"
            />
            <button
              onClick={() => toast.success("Activation code accepted! Your plan has been upgraded. 🎉")}
              className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors text-sm"
            >
              Activate
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pb-8">
          <div className="flex items-center justify-center gap-2 text-zinc-400 text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            SnapFlow &copy; {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </div>
  );
}
