import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const memberType = type === "contributor" ? "contributor" : "core";

  const { data, error } = await supabaseAdmin
    .from("team_members")
    .select("*")
    .eq("member_type", memberType)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json([]);
  }

  // Map DB rows to frontend format
  const members = (data || []).map((m) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    tagline: m.tagline,
    avatar: m.avatar,
    color: m.color,
    bio: m.bio || "",
    certifications: m.certifications || [],
    social: m.social || {},
  }));

  return NextResponse.json(members);
}

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const isContributor = body._type === "contributor";
    delete body._type;

    const id = body.id || (body.name || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if ID already exists
    const { data: existing } = await supabaseAdmin
      .from("team_members")
      .select("id")
      .eq("id", id)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Member with this ID already exists" }, { status: 400 });
    }

    const row = {
      id,
      name: body.name,
      role: body.role,
      tagline: body.tagline || "",
      avatar: body.avatar || "",
      color: body.color || "#A855F7",
      bio: body.bio || "",
      member_type: isContributor ? "contributor" : "core",
      certifications: body.certifications || [],
      social: body.social || {},
    };

    const { data, error } = await supabaseAdmin
      .from("team_members")
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error("Error creating member:", error);
      return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Error creating member:", err);
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}
