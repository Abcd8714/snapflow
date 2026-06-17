"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

// ── Built-in demo user ─────────────────────────────────────────
const DEMO_USER = {
  id: "demo-user-snapflow-001",
  name: "Demo User",
  email: "demo@snapflow.app",
  plan: "free" as const,
  creditsRemaining: 10,
  stripeCustomerId: null as string | null,
};
