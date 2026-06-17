import Anthropic from "@anthropic-ai/sdk";

export function getAnthropicClient(apiKey?: string) {
  const key = apiKey || process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("No Anthropic API key available");
  return new Anthropic({ apiKey: key });
}

export interface CopyGenerationInput {
  productName: string;
  productDescription: string;
  targetAudience: string;
  tone: "professional" | "casual" | "luxury" | "playful";
  platform: "amazon" | "shopify" | "etsy" | "social";
}

export interface CopyGenerationOutput {
  title: string;
  subtitle: string;
  bulletPoints: string[];
  seoDescription: string;
  socialCaption: string;
  hashtags: string[];
}

export async function generateProductCopy(
  input: CopyGenerationInput,
  apiKey?: string
): Promise<CopyGenerationOutput> {
  const anthropic = getAnthropicClient(apiKey);

  const toneMap = {
    professional: "professional and trustworthy",
    casual: "friendly and conversational",
    luxury: "premium and exclusive",
    playful: "fun and energetic",
  };

  const platformMap = {
    amazon: "Amazon product listing (title max 200 chars, bullet points, product description)",
    shopify: "Shopify product page (SEO-optimized title, compelling description)",
    etsy: "Etsy listing (creative, handmade-feel, SEO-friendly)",
    social: "social media post (short, engaging, with hashtags)",
  };

  const prompt = `You are an expert e-commerce copywriter. Generate compelling marketing content for this product:

PRODUCT: ${input.productName}
DESCRIPTION: ${input.productDescription}
TARGET AUDIENCE: ${input.targetAudience}
TONE: ${toneMap[input.tone]}
PLATFORM: ${platformMap[input.platform]}

Return ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "title": "compelling product title",
  "subtitle": "one-line value proposition",
  "bulletPoints": ["benefit 1", "benefit 2", "benefit 3", "benefit 4", "benefit 5"],
  "seoDescription": "SEO-optimized meta description under 160 chars",
  "socialCaption": "engaging social media caption with emoji",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0]?.type === "text" ? response.content[0].text : "";
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as CopyGenerationOutput;
}

export interface VideoScriptInput {
  productName: string;
  productDescription: string;
  duration: number; // seconds
  style: "unboxing" | "demo" | "lifestyle" | "comparison";
}

export interface VideoScriptOutput {
  title: string;
  totalDuration: number;
  scenes: {
    number: number;
    duration: number;
    visual: string;
    voiceover: string;
    textOverlay: string;
  }[];
  musicSuggestion: string;
}

export async function generateVideoScript(
  input: VideoScriptInput,
  apiKey?: string
): Promise<VideoScriptOutput> {
  const anthropic = getAnthropicClient(apiKey);

  const styleMap = {
    unboxing: "unboxing/first impressions - close-up shots, excitement",
    demo: "product demonstration - show features in action",
    lifestyle: "lifestyle/influencer style - aspirational setting with the product",
    comparison: "comparison/review - showing product advantages",
  };

  const prompt = `You are a professional video producer for e-commerce brands. Create a detailed ${input.duration}-second video script.

PRODUCT: ${input.productName}
DESCRIPTION: ${input.productDescription}
STYLE: ${styleMap[input.style]}
DURATION: ${input.duration} seconds

Divide into 4-6 scenes. Return ONLY valid JSON (no markdown, no code fences):
{
  "title": "catchy video title",
  "totalDuration": ${input.duration},
  "scenes": [
    {
      "number": 1,
      "duration": 5,
      "visual": "detailed shot description",
      "voiceover": "what the narrator says",
      "textOverlay": "on-screen text"
    }
  ],
  "musicSuggestion": "music mood/style suggestion"
}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1536,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0]?.type === "text" ? response.content[0].text : "";
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as VideoScriptOutput;
}

export interface ImageSceneInput {
  productName: string;
  productDescription: string;
  category: string;
  style: "studio" | "lifestyle" | "minimal" | "outdoor";
}

export interface ImageSceneOutput {
  sceneDescription: string;
  negativePrompt: string;
  lighting: string;
  cameraAngle: string;
  props: string[];
  colorPalette: string[];
}

export async function generateImageScene(
  input: ImageSceneInput,
  apiKey?: string
): Promise<ImageSceneOutput> {
  const anthropic = getAnthropicClient(apiKey);

  const styleMap = {
    studio: "clean studio lighting, white/neutral background, professional product photography",
    lifestyle: "natural setting, authentic use case, warm lighting, aspirational lifestyle photo",
    minimal: "minimalist aesthetic, single color background, shadow play, artistic composition",
    outdoor: "natural outdoor lighting, environmental context, golden hour, depth of field",
  };

  const prompt = `You are a professional product photographer and creative director. Generate a detailed AI image generation prompt for a product photo.

PRODUCT: ${input.productName}
DESCRIPTION: ${input.productDescription}
CATEGORY: ${input.category}
STYLE: ${styleMap[input.style]}

Return ONLY valid JSON (no markdown, no code fences):
{
  "sceneDescription": "detailed scene prompt suitable for AI image generation (Stable Diffusion / Midjourney), 1-3 sentences",
  "negativePrompt": "things to avoid in the image",
  "lighting": "detailed lighting setup description",
  "cameraAngle": "camera position and lens choice",
  "props": ["prop1", "prop2", "prop3"],
  "colorPalette": ["#HEX1", "#HEX2", "#HEX3", "#HEX4"]
}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0]?.type === "text" ? response.content[0].text : "";
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as ImageSceneOutput;
}
