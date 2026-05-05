import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/google/auth";
import { listFiles, createFolder } from "@/lib/google/drive";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const folderId = searchParams.get("folderId") ?? undefined;
  const query = searchParams.get("q") ?? undefined;
  const files = await listFiles(session.accessToken, folderId, query);
  return NextResponse.json({ files });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name, parentId } = await req.json();
  const folder = await createFolder(session.accessToken, name, parentId);
  return NextResponse.json({ folder });
}
