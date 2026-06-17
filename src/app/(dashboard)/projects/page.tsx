"use client";

import Link from "next/link";
import { Plus, FolderOpen, Camera, Video, PenTool } from "lucide-react";

const mockProjects = [
  { id: "1", name: "Summer Collection - Copy", type: "copy", status: "completed", description: "Amazon listing copy" },
  { id: "2", name: "Product Demo Video Script", type: "video", status: "draft", description: "30s unboxing video" },
  { id: "3", name: "Leather Bag Hero Scene", type: "image", status: "completed", description: "Studio setup" },
  { id: "4", name: "Social Media Bundle", type: "copy", status: "generating", description: "Instagram + TikTok" },
];

const typeIcons: Record<string, typeof Camera> = {
  image: Camera,
  video: Video,
  copy: PenTool,
};

export default function ProjectsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-zinc-500 mt-1">{mockProjects.length} project{mockProjects.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/generate"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockProjects.map((p) => {
          const Icon = typeIcons[p.type] || PenTool;
          return (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="p-5 rounded-2xl bg-white border border-zinc-200 hover:border-primary/30 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{p.name}</p>
                  <p className="text-xs text-zinc-400 capitalize">{p.type}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                  p.status === "completed"
                    ? "bg-emerald-50 text-emerald-600"
                    : p.status === "generating"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-zinc-100 text-zinc-500"
                }`}>
                  {p.status}
                </span>
                {p.description && (
                  <span className="text-xs text-zinc-400 truncate max-w-[150px]">{p.description}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
