"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const mockGenerations: Record<string, any[]> = {
  "1": [
    { id: "g1", type: "Product Copy", status: "completed", costCredits: 2, output: { title: "Premium Headphones — Studio Sound, Anywhere", subtitle: "Professional audio quality in a sleek, portable design", bulletPoints: ["Active noise cancellation", "40-hour battery life", "Memory foam ear cushions", "Bluetooth 5.3 + wired mode", "Foldable design"], seoDescription: "Experience premium audio with our noise-cancelling headphones. 40hr battery, memory foam comfort, and studio-quality sound.", socialCaption: "🎧 Silence the world. Premium headphones now available. Link in bio! #AudioQuality", hashtags: ["#PremiumAudio", "#NoiseCancelling", "#ShopNow"] } },
    { id: "g2", type: "Social Post", status: "completed", costCredits: 1, output: { caption: "Summer vibes incoming! ☀️ Our new collection drops next week. Tap the link to get early access. 👆", hashtags: ["#SummerCollection", "#NewArrival", "#ShopSmall"] } },
  ],
  "2": [
    { id: "g3", type: "Video Script", status: "draft", costCredits: 3, output: null },
  ],
  "3": [
    { id: "g4", type: "Image Scene", status: "completed", costCredits: 1, output: { sceneDescription: "A stunning studio shot of a handcrafted leather bag on a minimalist wooden surface, soft overhead lighting with subtle rim lights creating elegant shadows and highlighting the leather texture.", negativePrompt: "blurry, low quality, watermark, text, distorted", lighting: "Three-point studio lighting with large softbox overhead", cameraAngle: "Eye level, 85mm f/2.8, shallow depth of field", props: ["wooden stand", "linen cloth", "small plant"], colorPalette: ["#F5F0E8", "#3D3226", "#C4A67D", "#8B7355"] } },
  ],
};

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const generations = mockGenerations[id] || [];

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          {id === "1" ? "Summer Collection - Copy" : id === "2" ? "Product Demo Video Script" : id === "3" ? "Leather Bag Hero Scene" : "Social Media Bundle"}
        </h1>
        <p className="text-zinc-500 mt-1 capitalize">
          {id === "1" ? "copy" : id === "2" ? "video" : id === "3" ? "image" : "copy"} · {id === "2" ? "draft" : "completed"}
        </p>
      </div>

      {generations.length > 0 ? (
        <div className="space-y-4">
          {generations.map((g) => (
            <div key={g.id} className="p-5 rounded-2xl bg-white border border-zinc-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium capitalize">{g.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                    g.status === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-500"
                  }`}>
                    {g.status}
                  </span>
                </div>
                <span className="text-xs text-zinc-400">{g.costCredits} credit{g.costCredits > 1 ? "s" : ""}</span>
              </div>
              {g.output ? (
                <pre className="text-sm text-zinc-600 bg-zinc-50 p-4 rounded-xl overflow-x-auto max-h-96 overflow-y-auto font-sans">
                  {JSON.stringify(g.output, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-zinc-400 text-center py-8">No output yet. Run this generation from the AI Generate page.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200">
          <p className="text-zinc-400">No generations in this project yet.</p>
          <Link href="/generate" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors">
            Generate Content
          </Link>
        </div>
      )}
    </div>
  );
}
