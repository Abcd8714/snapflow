"use client";

import Link from "next/link";
import {
  FolderOpen,
  Plus,
  TrendingUp,
  CreditCard,
  Crown,
  ArrowRight,
  Camera,
  Video,
  PenTool,
  Sparkles,
} from "lucide-react";

// Mock data for demo (no DB needed to showcase the UI)
const mockStats = {
  totalProjects: 3,
  generationsThisMonth: 12,
  creditsRemaining: 10,
};

const recentProjects = [
  { id: "1", name: "Summer Collection Launch", type: "copy", status: "completed" },
  { id: "2", name: "Product Demo Video", type: "video", status: "draft" },
  { id: "3", name: "Hero Shot — Leather Bag", type: "image", status: "completed" },
];

export default function DashboardPage() {
  const quickActions = [
    { label: "Write Copy", icon: PenTool, href: "/generate?type=copy", color: "bg-blue-500" },
    { label: "Image Scene", icon: Camera, href: "/generate?type=image", color: "bg-violet-500" },
    { label: "Video Script", icon: Video, href: "/generate?type=video", color: "bg-pink-500" },
  ];

  const typeIcons: Record<string, typeof PenTool> = {
    copy: PenTool,
    video: Video,
    image: Camera,
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-zinc-500 mt-1">Welcome to SnapFlow 👋</p>
        </div>
        <Link
          href="/generate"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" /> New Generation
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={FolderOpen} color="bg-violet-100" iconColor="text-violet-600" label="Total Projects" value={mockStats.totalProjects} />
        <StatCard icon={TrendingUp} color="bg-emerald-100" iconColor="text-emerald-600" label="Generations (30d)" value={mockStats.generationsThisMonth} />
        <StatCard icon={CreditCard} color="bg-amber-100" iconColor="text-amber-600" label="Credits Remaining" value={mockStats.creditsRemaining} />
      </div>

      {/* Quick actions */}
      <h2 className="font-semibold text-lg mb-4">Quick Generate</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="p-5 rounded-2xl bg-white border border-zinc-200 hover:border-primary/30 hover:shadow-lg transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-medium">{action.label}</h3>
            <p className="text-sm text-zinc-500 mt-1">Start generating</p>
          </Link>
        ))}
      </div>

      {/* Recent projects */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Recent Projects</h2>
        <Link href="/projects" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {recentProjects.length > 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 divide-y divide-zinc-100">
          {recentProjects.map((p) => {
            const Icon = typeIcons[p.type] || PenTool;
            return (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-zinc-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-zinc-400 capitalize">{p.type} · {p.status}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                  p.status === "completed"
                    ? "bg-emerald-50 text-emerald-600"
                    : p.status === "draft"
                      ? "bg-zinc-100 text-zinc-500"
                      : "bg-amber-50 text-amber-600"
                }`}>
                  {p.status}
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function StatCard({ icon: Icon, color, iconColor, label, value }: {
  icon: typeof FolderOpen;
  color: string;
  iconColor: string;
  label: string;
  value: number;
}) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-zinc-200">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <p className="text-sm text-zinc-500">{label}</p>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12 bg-white rounded-2xl border border-zinc-200">
      <FolderOpen className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
      <p className="text-zinc-500 font-medium">No projects yet</p>
      <p className="text-zinc-400 text-sm mt-1">Create your first AI-generated content</p>
      <Link
        href="/generate"
        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
      >
        <Plus className="w-4 h-4" /> Start Creating
      </Link>
    </div>
  );
}
