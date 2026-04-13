import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function GET(request, { params }) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("certifications")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Certification not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: data.id,
    name: data.name,
    code: data.code,
    level: data.level,
    color: data.color,
    description: data.description,
    duration: data.duration,
    questions: data.questions,
    passingScore: data.passing_score,
    topics: data.topics || [],
    image: data.image || "",
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

    const row = {};
    if (updates.name !== undefined) row.name = updates.name;
    if (updates.code !== undefined) row.code = updates.code;
    if (updates.level !== undefined) row.level = updates.level;
    if (updates.color !== undefined) row.color = updates.color;
    if (updates.description !== undefined) row.description = updates.description;
    if (updates.duration !== undefined) row.duration = updates.duration;
    if (updates.questions !== undefined) row.questions = updates.questions;
    if (updates.passingScore !== undefined) row.passing_score = updates.passingScore;
    if (updates.topics !== undefined) row.topics = updates.topics;
    if (updates.image !== undefined) row.image = updates.image;

    const { data, error } = await supabaseAdmin
      .from("certifications")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: data.id,
      name: data.name,
      code: data.code,
      level: data.level,
      color: data.color,
      description: data.description,
      duration: data.duration,
      questions: data.questions,
      passingScore: data.passing_score,
      topics: data.topics || [],
      image: data.image || "",
    });
  } catch (err) {
    console.error("Error updating certification:", err);
    return NextResponse.json({ error: "Failed to update certification" }, { status: 500 });
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
      .from("certifications")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 });
  }
}
