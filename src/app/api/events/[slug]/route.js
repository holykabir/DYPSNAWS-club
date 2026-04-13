import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import supabaseAdmin from "@/lib/supabaseAdmin";

// Helper to map DB row to frontend format
function mapEvent(e) {
  return {
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
  };
}

export async function GET(request, { params }) {
  const { slug } = await params;

  const { data, error } = await supabaseAdmin
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(mapEvent(data));
}

export async function PUT(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const updates = await request.json();

    const row = {};
    if (updates.title !== undefined) row.title = updates.title;
    if (updates.date !== undefined) row.date = updates.date;
    if (updates.desc !== undefined) row.description = updates.desc;
    if (updates.type !== undefined) row.type = updates.type;
    if (updates.color !== undefined) row.color = updates.color;
    if (updates.location !== undefined) row.location = updates.location;
    if (updates.capacity !== undefined) row.capacity = updates.capacity;
    if (updates.status !== undefined) row.status = updates.status;
    if (updates.featured !== undefined) row.featured = updates.featured;
    if (updates.prerequisites !== undefined) row.prerequisites = updates.prerequisites;
    if (updates.schedule !== undefined) row.schedule = updates.schedule;
    if (updates.speakers !== undefined) row.speakers = updates.speakers;
    if (updates.formFields !== undefined) row.form_fields = updates.formFields;
    if (updates.images !== undefined) row.images = updates.images;
    if (updates.videos !== undefined) row.videos = updates.videos;

    const { data, error } = await supabaseAdmin
      .from("events")
      .update(row)
      .eq("slug", slug)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(mapEvent(data));
  } catch (err) {
    console.error("Error updating event:", err);
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

    const { error } = await supabaseAdmin
      .from("events")
      .delete()
      .eq("slug", slug);

    if (error) {
      return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
