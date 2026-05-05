/**
 * Gmail API helpers.
 * Uses the `googleapis` package with an OAuth2 access token from the session.
 */

import { google } from "googleapis";

function getGmailClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.gmail({ version: "v1", auth });
}

export async function listThreads(accessToken: string, query = "", maxResults = 25) {
  const gmail = getGmailClient(accessToken);
  const res = await gmail.users.threads.list({
    userId: "me",
    q: query,
    maxResults,
  });
  return res.data.threads ?? [];
}

export async function getThread(accessToken: string, threadId: string) {
  const gmail = getGmailClient(accessToken);
  const res = await gmail.users.threads.get({
    userId: "me",
    id: threadId,
    format: "full",
  });
  return res.data;
}

export async function sendEmail(
  accessToken: string,
  opts: { to: string; subject: string; body: string; threadId?: string }
) {
  const gmail = getGmailClient(accessToken);
  const raw = btoa(
    [
      `To: ${opts.to}`,
      `Subject: ${opts.subject}`,
      "Content-Type: text/plain; charset=utf-8",
      "",
      opts.body,
    ].join("\r\n")
  ).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw,
      ...(opts.threadId && { threadId: opts.threadId }),
    },
  });
  return res.data;
}

export async function createDraft(
  accessToken: string,
  opts: { to: string; subject: string; body: string }
) {
  const gmail = getGmailClient(accessToken);
  const raw = btoa(
    [
      `To: ${opts.to}`,
      `Subject: ${opts.subject}`,
      "Content-Type: text/plain; charset=utf-8",
      "",
      opts.body,
    ].join("\r\n")
  ).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const res = await gmail.users.drafts.create({
    userId: "me",
    requestBody: { message: { raw } },
  });
  return res.data;
}

export async function archiveThread(accessToken: string, threadId: string) {
  const gmail = getGmailClient(accessToken);
  await gmail.users.threads.modify({
    userId: "me",
    id: threadId,
    requestBody: { removeLabelIds: ["INBOX"] },
  });
}
