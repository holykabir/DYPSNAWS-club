import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readData, writeData } from "@/lib/dataStore";

export async function GET() {
  const events = readData("events");
  return NextResponse.json(events);
}

export async function POST(request) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const event = await request.json();
    const events = readData("events");

    // Generate slug from title if not provided
    if (!event.slug) {
      event.slug = event.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Check for duplicate slug
    if (events.find((e) => e.slug === event.slug)) {
      return NextResponse.json({ error: "Event with this slug already exists" }, { status: 400 });
    }

    // Set defaults
    event.images = event.images || [];
    event.videos = event.videos || [];
    event.schedule = event.schedule || [];
    event.prerequisites = event.prerequisites || [];
    event.speakers = event.speakers || [];

    events.push(event);
    writeData("events", events);

    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
