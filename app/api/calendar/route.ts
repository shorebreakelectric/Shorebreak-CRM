import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/google/auth";
import { listUpcomingEvents, createCalendarEvent } from "@/lib/google/calendar";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const events = await listUpcomingEvents(session.accessToken);
  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const event = await createCalendarEvent(session.accessToken, body);
  return NextResponse.json({ event });
}
