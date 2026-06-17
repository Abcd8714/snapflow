"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

// ── Built-in demo user — always logged in ─────────────────────────
const DEMO_USER = {
  id: "demo-user-snapflow-001",
  name: "Demo User",
  email: "demo@snapflow.app",
  plan: "free" as const,
  creditsRemaining: 10,
  stripeCustomerId: null as string | null,
};

type User = typeof DEMO_USER;

interface AuthContextType {
  user: User;
  isAuthenticated: true;
  isLoading: false;
  signOut: () => void;
  refreshCredits: () => void;
  useCredit: (amount: number) => boolean;
}

const STORAGE_KEY = "snapflow_user";

function loadUser(): User {
  if (typeof window === "undefined") return { ...DEMO_USER };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEMO_USER, ...JSON.parse(raw) };
  } catch {}
  return { ...DEMO_USER };
}

function saveUser(user: User) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ plan: user.plan, creditsRemaining: user.creditsRemaining })
    );
  } catch {}
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User>({ ...DEMO_USER });

  useEffect(() => {
    setUser(loadUser());
  }, []);

  function signOut() {
    saveUser({ ...DEMO_USER });
    setUser({ ...DEMO_USER });
    router.push("/");
  }

  function refreshCredits() {
    const fresh = loadUser();
    setUser(fresh);
  }

  function useCredit(amount: number): boolean {
    if (user.creditsRemaining < amount) return false;
    const updated = { ...user, creditsRemaining: user.creditsRemaining - amount };
    setUser(updated);
    saveUser(updated);
    return true;
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: true, isLoading: false, signOut, refreshCredits, useCredit }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) return { user: { ...DEMO_USER }, isAuthenticated: true, isLoading: false };
  return ctx;
}

export function useSignOut() {
  const { signOut } = useAuth();
  return signOut;
}
