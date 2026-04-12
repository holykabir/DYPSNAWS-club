import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readData, writeData } from "@/lib/dataStore";

export async function GET(request) {
  const events = readData("events");
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");

  if (featured === "true") {
    // Return only featured events (default to featured if field not set)
    return NextResponse.json(events.filter((e) => e.featured !== false));
  }

  return NextResponse.json(events);
}

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const event = await request.json();
    const events = readData("events");

    if (!event.slug) {
      event.slug = event.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    if (events.find((e) => e.slug === event.slug)) {
      return NextResponse.json({ error: "Event with this slug already exists" }, { status: 400 });
    }

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
