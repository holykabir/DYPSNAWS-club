import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");

  let query = supabaseAdmin.from("events").select("*").order("created_at", { ascending: false });

  if (featured === "true") {
    query = query.eq("featured", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json([], { status: 200 });
  }

  // Map DB columns to frontend format
  const events = (data || []).map((e) => ({
    slug: e.slug,
    title: e.title,
    date: e.date,
    desc: e.description,
    type: e.type,
    color: e.color,
    location: e.location,
    capacity: e.capacity,
    status: e.status,
    featured: e.featured,
    prerequisites: e.prerequisites || [],
    schedule: e.schedule || [],
    speakers: e.speakers || [],
    formFields: e.form_fields || [],
    images: e.images || [],
    videos: e.videos || [],
  }));

  return NextResponse.json(events);
}

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const event = await request.json();

    if (!event.slug) {
      event.slug = event.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Check if slug already exists
    const { data: existing } = await supabaseAdmin
      .from("events")
      .select("slug")
      .eq("slug", event.slug)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Event with this slug already exists" }, { status: 400 });
    }

    const row = {
      slug: event.slug,
      title: event.title,
      date: event.date,
      description: event.desc,
      type: event.type,
      color: event.color,
      location: event.location,
      capacity: event.capacity || 50,
      status: event.status || "Upcoming",
      featured: event.featured !== false,
      prerequisites: event.prerequisites || [],
      schedule: event.schedule || [],
      speakers: event.speakers || [],
      form_fields: event.formFields || [],
      images: event.images || [],
      videos: event.videos || [],
    };

    const { data, error } = await supabaseAdmin.from("events").insert(row).select().single();

    if (error) {
      console.error("Error creating event:", error);
      return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
    }

    return NextResponse.json({ ...event, slug: data.slug }, { status: 201 });
  } catch (err) {
    console.error("Error creating event:", err);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
