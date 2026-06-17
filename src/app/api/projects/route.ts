import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const list = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, session.user.id))
    .orderBy(desc(projects.createdAt));

  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const id = uuid();

  await db.insert(projects).values({
    id,
    userId: session.user.id,
    name: body.name || "Untitled Project",
    description: body.description || "",
    type: body.type || "copy",
    status: "draft",
  });

  return NextResponse.json({ id, success: true });
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();
  await db
    .delete(projects)
    .where(
      and(eq(projects.id, id), eq(projects.userId, session.user.id))
    );

  return NextResponse.json({ success: true });
}
