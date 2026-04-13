import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("certifications")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching certifications:", error);
    return NextResponse.json([]);
  }

  const certs = (data || []).map((c) => ({
    id: c.id,
    name: c.name,
    code: c.code,
    level: c.level,
    color: c.color,
    description: c.description,
    duration: c.duration,
    questions: c.questions,
    passingScore: c.passing_score,
    topics: c.topics || [],
    image: c.image || "",
  }));

  return NextResponse.json(certs);
}

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cert = await request.json();

    const id = cert.id || cert.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const { data: existing } = await supabaseAdmin
      .from("certifications")
      .select("id")
      .eq("id", id)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Certification with this ID already exists" }, { status: 400 });
    }

    const row = {
      id,
      name: cert.name,
      code: cert.code || "",
      level: cert.level || "",
      color: cert.color || "#A855F7",
      description: cert.description || "",
      duration: cert.duration || "",
      questions: cert.questions || 0,
      passing_score: cert.passingScore || "",
      topics: cert.topics || [],
      image: cert.image || "",
    };

    const { data, error } = await supabaseAdmin
      .from("certifications")
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error("Error creating certification:", error);
      return NextResponse.json({ error: "Failed to create certification" }, { status: 500 });
    }

    return NextResponse.json({ ...cert, id: data.id }, { status: 201 });
  } catch (err) {
    console.error("Error creating certification:", err);
    return NextResponse.json({ error: "Failed to create certification" }, { status: 500 });
  }
}
