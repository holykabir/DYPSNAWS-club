import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function GET(request, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const { data, error } = await supabaseAdmin
    .from("team_members")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: data.id,
    name: data.name,
    role: data.role,
    tagline: data.tagline,
    avatar: data.avatar,
    color: data.color,
    bio: data.bio || "",
    certifications: data.certifications || [],
    social: data.social || {},
  });
}

export async function PUT(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const updates = await request.json();
    delete updates._type;

    const row = {};
    if (updates.name !== undefined) row.name = updates.name;
    if (updates.role !== undefined) row.role = updates.role;
    if (updates.tagline !== undefined) row.tagline = updates.tagline;
    if (updates.avatar !== undefined) row.avatar = updates.avatar;
    if (updates.color !== undefined) row.color = updates.color;
    if (updates.bio !== undefined) row.bio = updates.bio;
    if (updates.certifications !== undefined) row.certifications = updates.certifications;
    if (updates.social !== undefined) row.social = updates.social;

    const { data, error } = await supabaseAdmin
      .from("team_members")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: data.id,
      name: data.name,
      role: data.role,
      tagline: data.tagline,
      avatar: data.avatar,
      color: data.color,
      bio: data.bio || "",
      certifications: data.certifications || [],
      social: data.social || {},
    });
  } catch (err) {
    console.error("Error updating member:", err);
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("team_members")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
