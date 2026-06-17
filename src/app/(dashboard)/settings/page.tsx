"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/session-provider";
import { CreditCard, Key, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { PLANS } from "@/lib/utils";

export default function SettingsPage() {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [loadingKey, setLoadingKey] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  async function fetchKeys() {
    const res = await fetch("/api/keys");
    if (res.ok) {
      const data = await res.json();
      setHasKey(data.length > 0);
    }
  }

  async function saveKey() {
    if (!apiKey.trim()) return;
    setLoadingKey(true);
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: "anthropic", key: apiKey.trim() }),
    });
    if (res.ok) {
      setHasKey(true);
      setApiKey("");
      toast.success("API key saved! Your AI generations will use your own key.");
    } else {
      toast.error("Failed to save API key");
    }
    setLoadingKey(false);
  }

  async function deleteKey() {
    setLoadingKey(true);
    const res = await fetch("/api/keys", { method: "DELETE", body: JSON.stringify({ id: "all" }) });
    if (res.ok) {
      setHasKey(false);
      toast.success("API key removed. Falling back to system default.");
    }
    setLoadingKey(false);
  }

  async function handleUpgrade(plan: string) {
    setLoadingCheckout(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to start checkout");
      }
    } catch {
      toast.error("Network error");
    }
    setLoadingCheckout(null);
  }

  const currentPlan = user?.plan || "free";
  const planInfo = PLANS[currentPlan as keyof typeof PLANS] || PLANS.free;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-zinc-500 mt-1">Manage your account and billing</p>
      </div>

      {/* Plan */}
      <section className="p-6 rounded-2xl bg-white border border-zinc-200">
        <h2 className="font-semibold text-lg mb-1">Your Plan</h2>
        <p className="text-zinc-500 text-sm mb-4">Current subscription</p>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold capitalize">{planInfo.name} Plan</p>
            <p className="text-sm text-zinc-500">
              {planInfo.credits === Infinity ? "Unlimited" : planInfo.credits} credits · ${planInfo.price}/mo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(["starter", "pro", "business"] as const).map((plan) => {
            const p = PLANS[plan];
            const isCurrent = plan === (currentPlan as string);
            return (
              <button
                key={plan}
                disabled={isCurrent || loadingCheckout === plan}
                onClick={() => handleUpgrade(plan)}
                className={`p-4 rounded-xl border-2 text-left transition-colors ${
                  isCurrent
                    ? "border-primary bg-primary/5"
                    : "border-zinc-200 hover:border-primary/30"
                } disabled:cursor-default`}
              >
                <p className="font-semibold capitalize">{p.name}</p>
                <p className="text-sm text-zinc-500">
                  {p.credits === Infinity ? "Unlimited" : p.credits} credits
                </p>
                <p className="text-lg font-bold mt-1">
                  ${p.price}
                  <span className="text-sm font-normal text-zinc-400">/mo</span>
                </p>
                {isCurrent && (
                  <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-primary">
                    <Check className="w-3 h-3" /> Current Plan
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* API Key */}
      <section className="p-6 rounded-2xl bg-white border border-zinc-200">
        <h2 className="font-semibold text-lg mb-1">Claude API Key</h2>
        <p className="text-zinc-500 text-sm mb-4">
          Use your own Anthropic API key for AI generations. Otherwise, the system default key is used.
        </p>

        {hasKey ? (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 mb-4">
            <Key className="w-5 h-5 text-emerald-600" />
            <span className="text-sm text-emerald-700 font-medium">
              API key configured
            </span>
            <button
              onClick={deleteKey}
              disabled={loadingKey}
              className="ml-auto text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm"
            />
            <button
              onClick={saveKey}
              disabled={!apiKey.trim() || loadingKey}
              className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loadingKey && <Loader2 className="w-4 h-4 animate-spin" />}
              Save
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
