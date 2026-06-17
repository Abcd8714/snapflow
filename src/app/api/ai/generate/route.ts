import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  generateProductCopy,
  generateVideoScript,
  generateImageScene,
} from "@/lib/ai";
import { db } from "@/lib/db";
import { projects, generations, apiKeys, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getCreditCost } from "@/lib/utils";
import { v4 as uuid } from "uuid";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await request.json();
  const { type, projectId, input } = body;

  if (!type || !input) {
    return NextResponse.json(
      { error: "type and input are required" },
      { status: 400 }
    );
  }

  const cost = getCreditCost(type);
  const creditsRemaining = (session.user as any).creditsRemaining ?? 0;

  if (creditsRemaining < cost) {
    return NextResponse.json(
      { error: `Insufficient credits. Need ${cost}, have ${creditsRemaining}.` },
      { status: 402 }
    );
  }

  // Get user's API key if provided
  const [userApiKey] = await db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.userId, userId), eq(apiKeys.provider, "anthropic")))
    .limit(1);

  const anthropicKey = userApiKey?.key;

  try {
    let result: any;

    switch (type) {
      case "product_copy":
        result = await generateProductCopy(input, anthropicKey);
        break;
      case "video_script":
        result = await generateVideoScript(input, anthropicKey);
        break;
      case "image_scene":
        result = await generateImageScene(input, anthropicKey);
        break;
      default:
        return NextResponse.json(
          { error: `Unknown generation type: ${type}` },
          { status: 400 }
        );
    }

    // Find or create project
    let pid = projectId;
    if (!pid) {
      const projId = uuid();
      await db.insert(projects).values({
        id: projId,
        userId,
        name: input.productName || "Untitled",
        type: type.startsWith("image") ? "image" : type.startsWith("video") ? "video" : "copy",
        status: "completed",
      });
      pid = projId;
    }

    // Save generation
    const genId = uuid();
    await db.insert(generations).values({
      id: genId,
      projectId: pid,
      userId,
      type: type as any,
      input: JSON.stringify(input),
      output: JSON.stringify(result),
      status: "completed",
      costCredits: cost,
    });

    // Deduct credits from user
    await db
      .update(users)
      .set({
        creditsRemaining: creditsRemaining - cost,
        monthlyCreditsUsed: ((session.user as any).monthlyCreditsUsed ?? 0) + cost,
      })
      .where(eq(users.id, userId));

    return NextResponse.json({
      success: true,
      generation: { id: genId, type, output: result, costCredits: cost },
      projectId: pid,
    });
  } catch (error: any) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: error.message || "Generation failed" },
      { status: 500 }
    );
  }
}
