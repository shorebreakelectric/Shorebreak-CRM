import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/google/auth";
import { google } from "googleapis";

function getDriveClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.drive({ version: "v3", auth });
}

async function findFolderByName(drive: ReturnType<typeof google.drive>, name: string, parentId?: string) {
  const q = [
    `name = '${name}'`,
    `mimeType = 'application/vnd.google-apps.folder'`,
    `trashed = false`,
    parentId ? `'${parentId}' in parents` : null,
  ].filter(Boolean).join(" and ");

  const res = await drive.files.list({
    q,
    fields: "files(id, name)",
    pageSize: 5,
  });
  return res.data.files?.[0] ?? null;
}

async function listChildren(drive: ReturnType<typeof google.drive>, parentId: string) {
  const res = await drive.files.list({
    q: `'${parentId}' in parents and trashed = false`,
    fields: "files(id, name, mimeType, size, modifiedTime, webViewLink)",
    orderBy: "name",
    pageSize: 100,
  });
  return res.data.files ?? [];
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const drive = getDriveClient(session.accessToken);
  const { searchParams } = new URL(req.url);
  const folderId = searchParams.get("folderId");

  try {
    // If a specific folder ID is provided, list its contents
    if (folderId) {
      const files = await listChildren(drive, folderId);
      return NextResponse.json({ files });
    }

    // Otherwise, navigate to shorebreakelectric > Shorebreak Jobs
    const rootFolder = await findFolderByName(drive, "Shorebreak Electric");
    if (!rootFolder) {
      return NextResponse.json({ error: "Could not find 'shorebreakelectric' folder in Drive" }, { status: 404 });
    }

    const jobsFolder = await findFolderByName(drive, "Shorebreak Jobs", rootFolder.id!);
    if (!jobsFolder) {
      return NextResponse.json({ error: "Could not find 'Shorebreak Jobs' folder" }, { status: 404 });
    }

    const children = await listChildren(drive, jobsFolder.id!);

    // Separate active projects (folders) from other files
    const projectFolders = children.filter(f => f.mimeType === "application/vnd.google-apps.folder");
    const files = children.filter(f => f.mimeType !== "application/vnd.google-apps.folder");

    return NextResponse.json({
      rootFolderId: rootFolder.id,
      jobsFolderId: jobsFolder.id,
      projectFolders,
      files,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Drive API error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
