"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Sparkles,
  Settings,
  LogOut,
  CreditCard,
  Menu,
  X,
  Crown,
} from "lucide-react";
import { useState } from "react";
import { useAuth, useSignOut } from "@/components/session-provider";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/generate", label: "AI Generate", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const signOut = useSignOut();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-zinc-200 p-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl mb-8 px-3">
          <Sparkles className="w-6 h-6 text-primary" />
          SnapFlow
        </Link>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Plan badge */}
        <Link
          href="/upgrade"
          className="mb-4 p-3 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors block group"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-primary mb-1">
            <CreditCard className="w-4 h-4" />
            {user?.plan || "Free"} Plan
          </div>
          <p className="text-xs text-zinc-500">
            {user?.creditsRemaining ?? 0} credits remaining
          </p>
          <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-primary/70 group-hover:text-primary">
            <Crown className="w-3 h-3" /> Upgrade now
          </span>
        </Link>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:bg-zinc-100 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-10 flex flex-col w-72 bg-white p-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="self-end p-2 mb-4 text-zinc-500"
            >
              <X className="w-5 h-5" />
            </button>
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl mb-8 px-3">
              <Sparkles className="w-6 h-6 text-primary" />
              SnapFlow
            </Link>
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:bg-zinc-100 w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-zinc-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-700"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm text-zinc-600">{user?.email}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
