/**
 * Google Drive API helpers.
 * Uses the `googleapis` package with an OAuth2 access token from the session.
 */

import { google } from "googleapis";

function getDriveClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.drive({ version: "v3", auth });
}

export async function listFiles(accessToken: string, folderId?: string, query?: string) {
  const drive = getDriveClient(accessToken);
  const q = [
    folderId ? `'${folderId}' in parents` : null,
    query || null,
    "trashed = false",
  ].filter(Boolean).join(" and ");

  const res = await drive.files.list({
    q,
    fields: "files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink,parents)",
    orderBy: "modifiedTime desc",
    pageSize: 50,
  });
  return res.data.files ?? [];
}

export async function uploadFile(
  accessToken: string,
  opts: { name: string; mimeType: string; content: Buffer; folderId?: string }
) {
  const drive = getDriveClient(accessToken);
  const { Readable } = await import("stream");
  const stream = Readable.from(opts.content);

  const res = await drive.files.create({
    requestBody: {
      name: opts.name,
      mimeType: opts.mimeType,
      parents: opts.folderId ? [opts.folderId] : undefined,
    },
    media: { mimeType: opts.mimeType, body: stream },
    fields: "id,name,webViewLink",
  });
  return res.data;
}

export async function createFolder(accessToken: string, name: string, parentId?: string) {
  const drive = getDriveClient(accessToken);
  const res = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: parentId ? [parentId] : undefined,
    },
    fields: "id,name,webViewLink",
  });
  return res.data;
}

export async function getFileUrl(accessToken: string, fileId: string): Promise<string | null> {
  const drive = getDriveClient(accessToken);
  const res = await drive.files.get({ fileId, fields: "webViewLink" });
  return res.data.webViewLink ?? null;
}

export async function deleteFile(accessToken: string, fileId: string) {
  const drive = getDriveClient(accessToken);
  await drive.files.delete({ fileId });
}
