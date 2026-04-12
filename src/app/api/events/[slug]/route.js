import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readData, writeData } from "@/lib/dataStore";

export async function GET(request, { params }) {
  const { slug } = await params;
  const events = readData("events");
  const event = events.find((e) => e.slug === slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
  return NextResponse.json(event);
}

export async function PUT(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const updates = await request.json();
    const events = readData("events");
    const index = events.findIndex((e) => e.slug === slug);

    if (index === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    events[index] = { ...events[index], ...updates };
    writeData("events", events);

    return NextResponse.json(events[index]);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const events = readData("events");
    const filtered = events.filter((e) => e.slug !== slug);

    if (filtered.length === events.length) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    writeData("events", filtered);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
