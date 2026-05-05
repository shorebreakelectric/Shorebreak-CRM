/**
 * Google Calendar API helpers.
 * Uses the `googleapis` package with an OAuth2 access token from the session.
 */

import { google } from "googleapis";

function getCalendarClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.calendar({ version: "v3", auth });
}

export async function listUpcomingEvents(accessToken: string, maxResults = 20) {
  const cal = getCalendarClient(accessToken);
  const res = await cal.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults,
    singleEvents: true,
    orderBy: "startTime",
  });
  return res.data.items ?? [];
}

export async function createCalendarEvent(
  accessToken: string,
  event: {
    summary: string;
    description?: string;
    location?: string;
    start: string;
    end: string;
    attendees?: string[];
  }
) {
  const cal = getCalendarClient(accessToken);
  const res = await cal.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: event.summary,
      description: event.description,
      location: event.location,
      start: { dateTime: event.start, timeZone: "America/Los_Angeles" },
      end: { dateTime: event.end, timeZone: "America/Los_Angeles" },
      attendees: event.attendees?.map(email => ({ email })),
    },
  });
  return res.data;
}

export async function updateCalendarEvent(
  accessToken: string,
  eventId: string,
  updates: Partial<{ summary: string; description: string; location: string; start: string; end: string }>
) {
  const cal = getCalendarClient(accessToken);
  const res = await cal.events.patch({
    calendarId: "primary",
    eventId,
    requestBody: {
      ...(updates.summary && { summary: updates.summary }),
      ...(updates.description && { description: updates.description }),
      ...(updates.location && { location: updates.location }),
      ...(updates.start && { start: { dateTime: updates.start, timeZone: "America/Los_Angeles" } }),
      ...(updates.end && { end: { dateTime: updates.end, timeZone: "America/Los_Angeles" } }),
    },
  });
  return res.data;
}

export async function deleteCalendarEvent(accessToken: string, eventId: string) {
  const cal = getCalendarClient(accessToken);
  await cal.events.delete({ calendarId: "primary", eventId });
}
