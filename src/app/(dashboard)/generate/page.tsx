"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Loader2,
  Camera,
  Video,
  PenTool,
  Crown,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

type GenerationType = "product_copy" | "image_scene" | "video_script";
type Tone = "professional" | "casual" | "luxury" | "playful";
type Platform = "amazon" | "shopify" | "etsy" | "social";
type Style = "studio" | "lifestyle" | "minimal" | "outdoor";
type VideoStyle = "unboxing" | "demo" | "lifestyle" | "comparison";

const typeMeta: Record<
  GenerationType,
  { label: string; icon: typeof PenTool; emoji: string; cost: number }
> = {
  product_copy: { label: "Product Copy", icon: PenTool, emoji: "📝", cost: 2 },
  image_scene: { label: "Image Scene", icon: Camera, emoji: "📸", cost: 1 },
  video_script: { label: "Video Script", icon: Video, emoji: "🎬", cost: 3 },
};

const RESPONSIVE_BREAKPOINTS = [
  "xs" as const,
  "sm" as const,
  "md" as const,
  "lg" as const,
  "xl" as const,
  "2xl" as const,
];

interface CopyForm {
  productName: string;
  productDescription: string;
  targetAudience: string;
  tone: Tone;
  platform: Platform;
}

interface ImageForm {
  productName: string;
  productDescription: string;
  category: string;
  style: Style;
}

interface VideoForm {
  productName: string;
  productDescription: string;
  duration: number;
  style: VideoStyle;
}

const defaultCopyForm: CopyForm = {
  productName: "",
  productDescription: "",
  targetAudience: "online shoppers",
  tone: "professional",
  platform: "shopify",
};

const defaultImageForm: ImageForm = {
  productName: "",
  productDescription: "",
  category: "electronics",
  style: "studio",
};

const defaultVideoForm: VideoForm = {
  productName: "",
  productDescription: "",
  duration: 30,
  style: "demo",
};

// ── Mock generation: simulates AI without needing an API key ─────────────
function simulateGeneration(type: GenerationType, form: any): string {
  const placeholderData: Record<GenerationType, any> = {
    product_copy: {
      title: `${form.productName || "Your Product"} — Premium Quality | Fast Shipping`,
      subtitle: `The ${form.tone || "professional"} choice for ${form.targetAudience || "everyone"}`,
      bulletPoints: [
        "Premium materials for long-lasting durability",
        "Ergonomic design for maximum comfort",
        "Fast & free shipping worldwide",
        "30-day money-back guarantee",
        "24/7 customer support included",
      ],
      seoDescription: `Shop the best ${form.productName || "product"} online. Premium quality, fast shipping, and 30-day returns. Perfect for ${form.targetAudience || "you"}.`,
      socialCaption: `✨ Meet your new favorite ${form.productName || "product"}! Designed for ${form.targetAudience || "you"} with premium quality and style. Tap to shop! 🛍️`,
      hashtags: ["#PremiumQuality", "#ShopNow", "#MustHave", "#BestSeller", "#NewArrival"],
    },
    image_scene: {
      sceneDescription: `A stunning ${form.style || "studio"} shot of ${form.productName || "the product"} — ${form.productDescription || "elegantly lit with soft shadows"}. Shot on a clean, modern set with professional lighting emphasizing texture and detail.`,
      negativePrompt: "blurry, low quality, watermark, text, logo, distorted, ugly, bad lighting, harsh shadows, cluttered background",
      lighting: `${form.style === "studio" ? "Three-point lighting with a large softbox overhead, two strip lights at 45° angles for rim light" : "Natural golden-hour sunlight streaming through a window, warm and inviting"}`,
      cameraAngle: "Eye-level, slightly elevated (15°), 85mm prime lens at f/2.8 for beautiful bokeh and sharp detail on the product",
      props: ["minimal wooden stand", "neutral linen backdrop", "small decorative plant"],
      colorPalette: ["#F5F5F0", "#2C2C2C", "#D4A574", "#8B7355"],
    },
    video_script: {
      title: `${form.productName || "Product"} — ${form.style === "unboxing" ? "First Look & Unboxing" : form.style === "demo" ? "In-Depth Demo" : form.style === "lifestyle" ? "A Day in the Life" : "Why It's Better"}`,
      totalDuration: form.duration || 30,
      scenes: [
        {
          number: 1,
          duration: Math.floor((form.duration || 30) * 0.15),
          visual: `Opening shot — ${form.productName || "product"} revealed on a clean surface, camera slowly pushes in`,
          voiceover: `Introducing the all-new ${form.productName || "product"} — designed for those who demand the best.`,
          textOverlay: `${form.productName || "NEW PRODUCT"} — Now Available`,
        },
        {
          number: 2,
          duration: Math.floor((form.duration || 30) * 0.3),
          visual: `Close-up details — hands interacting with the product, showing key features`,
          voiceover: `Every detail has been carefully crafted. ${form.productDescription || "Premium quality you can feel."}`,
          textOverlay: "Premium Craftsmanship",
        },
        {
          number: 3,
          duration: Math.floor((form.duration || 30) * 0.25),
          visual: `Lifestyle context — person using the product in a beautiful environment, smiling`,
          voiceover: `It fits seamlessly into your life. Whether at work or play, it's the perfect companion.`,
          textOverlay: "Designed for Your Life",
        },
        {
          number: 4,
          duration: Math.floor((form.duration || 30) * 0.2),
          visual: `Split screen — comparing features side by side, highlighting advantages`,
          voiceover: `Don't settle for less. Experience the difference quality makes.`,
          textOverlay: "The Clear Choice",
        },
        {
          number: 5,
          duration: Math.floor((form.duration || 30) * 0.1),
          visual: `Product centered, logo fade-in, call to action`,
          voiceover: `${form.productName || "Get yours"} — available now. Link in bio.`,
          textOverlay: "Shop Now →",
        },
      ],
      musicSuggestion: "Modern, upbeat instrumental — electronic/acoustic blend, 120 BPM, motivational but not overpowering",
    },
  };
  return JSON.stringify(placeholderData[type] || placeholderData.product_copy, null, 2);
}
// ── End mock generation ──────────────────────────────────────────────────

export default function GeneratePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [genType, setGenType] = useState<GenerationType>(
    (searchParams.get("type") as GenerationType) || "product_copy"
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [creditsRemaining, setCreditsRemaining] = useState<number>(10);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const [copyForm, setCopyForm] = useState<CopyForm>(defaultCopyForm);
  const [imageForm, setImageForm] = useState<ImageForm>(defaultImageForm);
  const [videoForm, setVideoForm] = useState<VideoForm>(defaultVideoForm);

  const meta = typeMeta[genType];

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();

    if (creditsRemaining <= 0) {
      setShowUpgrade(true);
      toast.error("Out of credits! Upgrade to continue generating.");
      return;
    }

    setLoading(true);
    setResult(null);
    setShowUpgrade(false);

    // Simulate AI processing delay
    await new Promise((r) => setTimeout(r, 1200));

    let form: any;
    if (genType === "product_copy") form = copyForm;
    else if (genType === "image_scene") form = imageForm;
    else form = videoForm;

    const json = simulateGeneration(genType, form);
    const parsed = JSON.parse(json);
    setResult(parsed);

    const newCredits = creditsRemaining - meta.cost;
    setCreditsRemaining(Math.max(0, newCredits));

    toast.success(
      `Generated! ${meta.cost} credit${meta.cost > 1 ? "s" : ""} used. ${Math.max(0, newCredits)} remaining.`
    );

    setLoading(false);
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  }

  function handleDownloadJSON() {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `snapflow-${genType}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">AI Generate</h1>
          <p className="text-zinc-500 mt-1">
            Create e-commerce content instantly
          </p>
        </div>
        {/* Credit counter */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white border border-zinc-200 text-sm">
            <span className="font-bold text-primary">{creditsRemaining}</span>{" "}
            <span className="text-zinc-500">credits</span>
          </div>
          <Link
            href="/upgrade"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
          >
            <Crown className="w-4 h-4" />
            Get More
          </Link>
        </div>
      </div>

      {/* Upgrade prompt banner */}
      {showUpgrade && (
        <div className="mb-8 p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 animate-in">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6 text-amber-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 text-lg">Out of Credits!</h3>
              <p className="text-amber-700 mt-1 mb-4">
                You've used all your free credits. Upgrade to continue generating unlimited content.
                Plans start at just <strong>¥29/month</strong>.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/upgrade"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors"
                >
                  <Crown className="w-4 h-4" />
                  View Plans & Upgrade
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setShowUpgrade(false)}
                  className="px-5 py-2.5 bg-white text-zinc-600 rounded-xl font-medium border border-zinc-200 hover:bg-zinc-50 transition-colors text-sm"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Type tabs */}
      <div className="flex gap-2 mb-8 p-1 bg-white rounded-2xl border border-zinc-200 inline-flex overflow-x-auto w-full sm:w-auto">
        {(Object.entries(typeMeta) as [GenerationType, (typeof typeMeta)[GenerationType]][]).map(
          ([key, t]) => (
            <button
              key={key}
              onClick={() => {
                setGenType(key);
                setResult(null);
                setShowUpgrade(false);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                genType === key
                  ? "bg-primary text-white shadow"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              <span className="text-xs opacity-70">({t.cost} cr)</span>
            </button>
          )
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="p-6 rounded-2xl bg-white border border-zinc-200">
          <h2 className="font-semibold text-lg mb-6">
            {meta.emoji} {meta.label} Generator
          </h2>

          {genType === "product_copy" && (
            <CopyFormFields
              form={copyForm}
              onChange={setCopyForm}
              onSubmit={handleGenerate}
              loading={loading}
              label={meta.label}
            />
          )}

          {genType === "image_scene" && (
            <ImageFormFields
              form={imageForm}
              onChange={setImageForm}
              onSubmit={handleGenerate}
              loading={loading}
              label={meta.label}
            />
          )}

          {genType === "video_script" && (
            <VideoFormFields
              form={videoForm}
              onChange={setVideoForm}
              onSubmit={handleGenerate}
              loading={loading}
              label={meta.label}
            />
          )}
        </div>

        {/* Result */}
        <div className="p-6 rounded-2xl bg-white border border-zinc-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Generated Result</h2>
            {result && (
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadJSON}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors"
                >
                  <DownloadIcon className="w-4 h-4" /> JSON
                </button>
                <button
                  onClick={() => handleCopy(JSON.stringify(result, null, 2))}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                >
                  <CopyIcon className="w-4 h-4" />
                  Copy All
                </button>
              </div>
            )}
          </div>

          {result ? (
            <ResultRenderer type={genType} result={result} onCopy={handleCopy} />
          ) : (
            <EmptyResult meta={meta} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────

type FormProps = {
  onSubmit: (e: FormEvent) => void;
  loading: boolean;
  label: string;
};

function CopyFormFields({
  form,
  onChange,
  onSubmit,
  loading,
  label,
}: FormProps & { form: CopyForm; onChange: (f: CopyForm) => void }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <InputField label="Product Name" required value={form.productName} onChange={(v) => onChange({ ...form, productName: v })} placeholder="e.g., Wireless Noise-Cancelling Headphones" />
      <TextareaField label="Product Description" required rows={3} value={form.productDescription} onChange={(v) => onChange({ ...form, productDescription: v })} placeholder="Key features, materials, benefits..." />
      <div className="grid grid-cols-2 gap-3">
        <SelectField label="Tone" value={form.tone} onChange={(v) => onChange({ ...form, tone: v as Tone })} options={["professional", "casual", "luxury", "playful"]} />
        <SelectField label="Platform" value={form.platform} onChange={(v) => onChange({ ...form, platform: v as Platform })} options={["shopify", "amazon", "etsy", "social"]} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Target Audience</label>
        <input type="text" value={form.targetAudience} onChange={(e) => onChange({ ...form, targetAudience: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g., fitness enthusiasts" />
      </div>
      <SubmitButton loading={loading} label={label} />
    </form>
  );
}

function ImageFormFields({
  form,
  onChange,
  onSubmit,
  loading,
  label,
}: FormProps & { form: ImageForm; onChange: (f: ImageForm) => void }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <InputField label="Product Name" required value={form.productName} onChange={(v) => onChange({ ...form, productName: v })} placeholder="e.g., Handcrafted Leather Watch" />
      <TextareaField label="Product Description" required rows={3} value={form.productDescription} onChange={(v) => onChange({ ...form, productDescription: v })} placeholder="Materials, colors, size, texture..." />
      <div className="grid grid-cols-2 gap-3">
        <SelectField label="Category" value={form.category} onChange={(v) => onChange({ ...form, category: v })} options={["electronics", "fashion", "home", "beauty", "food", "sports"]} />
        <SelectField label="Style" value={form.style} onChange={(v) => onChange({ ...form, style: v as Style })} options={["studio", "lifestyle", "minimal", "outdoor"]} />
      </div>
      <SubmitButton loading={loading} label={label} />
    </form>
  );
}

function VideoFormFields({
  form,
  onChange,
  onSubmit,
  loading,
  label,
}: FormProps & { form: VideoForm; onChange: (f: VideoForm) => void }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <InputField label="Product Name" required value={form.productName} onChange={(v) => onChange({ ...form, productName: v })} placeholder="e.g., Smart Fitness Watch Pro" />
      <TextareaField label="Product Description" required rows={3} value={form.productDescription} onChange={(v) => onChange({ ...form, productDescription: v })} placeholder="Key selling points, unique features..." />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1.5">Duration (seconds)</label>
          <input type="number" value={form.duration} onChange={(e) => onChange({ ...form, duration: parseInt(e.target.value) || 30 })} className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" min={15} max={120} />
        </div>
        <SelectField label="Style" value={form.style} onChange={(v) => onChange({ ...form, style: v as VideoStyle })} options={["demo", "unboxing", "lifestyle", "comparison"]} />
      </div>
      <SubmitButton loading={loading} label={label} />
    </form>
  );
}

// ── Reusable field components ──────────────────────────────────────────
function InputField({ label, required, value, onChange, placeholder }: { label: string; required?: boolean; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input type="text" required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" placeholder={placeholder} />
    </div>
  );
}

function TextareaField({ label, required, rows, value, onChange, placeholder }: { label: string; required?: boolean; rows: number; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <textarea required={required} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" placeholder={placeholder} />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none capitalize">
        {options.map((o) => (
          <option key={o} value={o} className="capitalize">{o}</option>
        ))}
      </select>
    </div>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          Generate {label}
        </>
      )}
    </button>
  );
}

function EmptyResult({ meta }: { meta: (typeof typeMeta)[GenerationType] }) {
  const Icon = meta.icon;
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <p className="text-zinc-500 font-medium">Your {meta.label} will appear here</p>
      <p className="text-zinc-400 text-sm mt-1 max-w-xs">
        Fill in the form and click Generate. Results are instant demo data (connect your API key in Settings for real AI).
      </p>
    </div>
  );
}

function ResultRenderer({ type, result, onCopy }: { type: GenerationType; result: any; onCopy: (text: string) => void }) {
  return (
    <div className="space-y-4">
      {type === "product_copy" && (
        <>
          <ResultSection label="Title" value={result.title} />
          <ResultSection label="Subtitle" value={result.subtitle} />
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase mb-2">Bullet Points</p>
            <ul className="space-y-1.5">
              {result.bulletPoints?.map((bp: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-700">
                  <span className="text-primary mt-0.5">•</span> {bp}
                </li>
              ))}
            </ul>
          </div>
          <ResultSection label="SEO Description" value={result.seoDescription} />
          <ResultSection label="Social Caption" value={result.socialCaption} />
          <TagList label="Hashtags" items={result.hashtags} color="bg-primary/5 text-primary" />
        </>
      )}

      {type === "image_scene" && (
        <>
          <ResultSection label="Scene Description" value={result.sceneDescription} />
          <CopyButton text={result.sceneDescription} onCopy={onCopy} />
          <ResultSection label="Negative Prompt" value={result.negativePrompt} />
          <ResultSection label="Lighting" value={result.lighting} />
          <ResultSection label="Camera Angle" value={result.cameraAngle} />
          <TagList label="Props" items={result.props} color="bg-violet-50 text-violet-600" />
          <ColorPalette colors={result.colorPalette} />
        </>
      )}

      {type === "video_script" && (
        <>
          <ResultSection label="Title" value={result.title} />
          <ResultSection label="Duration" value={`${result.totalDuration}s`} />
          <div className="space-y-3">
            <p className="text-xs font-medium text-zinc-400 uppercase">Scenes</p>
            {result.scenes?.map((scene: any) => (
              <SceneCard key={scene.number} scene={scene} />
            ))}
          </div>
          {result.musicSuggestion && <ResultSection label="Music" value={result.musicSuggestion} />}
        </>
      )}
      <p className="text-xs text-zinc-400 pt-4 border-t border-zinc-100">
        💡 This is demo data. Connect your Claude API key in{" "}
        <Link href="/settings" className="text-primary underline">Settings</Link>{" "}
        for real AI-generated content.
      </p>
    </div>
  );
}

function ResultSection({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium text-zinc-400 uppercase mb-1">{label}</p>
      <p className="text-sm text-zinc-700 leading-relaxed">{value}</p>
    </div>
  );
}

function CopyButton({ text, onCopy }: { text: string; onCopy: (t: string) => void }) {
  if (!text) return null;
  return (
    <button onClick={() => onCopy(text)} className="mt-1 text-xs text-primary font-medium hover:underline">
      Copy to clipboard →
    </button>
  );
}

function TagList({ label, items, color }: { label: string; items: string[]; color: string }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="text-xs font-medium text-zinc-400 uppercase mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item: string, i: number) => (
          <span key={i} className={`px-2 py-1 rounded-lg text-xs font-medium ${color}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function ColorPalette({ colors }: { colors: string[] }) {
  if (!colors?.length) return null;
  return (
    <div>
      <p className="text-xs font-medium text-zinc-400 uppercase mb-2">Color Palette</p>
      <div className="flex gap-2">
        {colors.map((c: string, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg border border-zinc-200" style={{ backgroundColor: c }} />
            <span className="text-xs text-zinc-500 font-mono">{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SceneCard({ scene }: { scene: any }) {
  return (
    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 rounded-lg bg-primary text-white text-xs font-bold flex items-center justify-center">
          {scene.number}
        </span>
        <span className="text-sm font-medium">Scene {scene.number}</span>
        <span className="text-xs text-zinc-400 ml-auto">{scene.duration}s</span>
      </div>
      <div className="space-y-2 text-sm">
        <FieldRow label="Visual" value={scene.visual} />
        <FieldRow label="Voiceover" value={scene.voiceover} italic />
        <FieldRow label="Overlay" value={scene.textOverlay} />
      </div>
    </div>
  );
}

function FieldRow({ label, value, italic }: { label: string; value: string; italic?: boolean }) {
  return (
    <div>
      <span className="font-medium text-zinc-500">{label}: </span>
      <span className={`text-zinc-700 ${italic ? "italic" : ""}`}>{value}</span>
    </div>
  );
}

// Inline SVG icons (no extra imports)
function DownloadIcon(props: { className?: string }) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function CopyIcon(props: { className?: string }) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
