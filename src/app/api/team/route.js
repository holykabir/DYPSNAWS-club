import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readData, writeData } from "@/lib/dataStore";

export async function GET(request) {
  const data = readData("team");
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  // Auto-generate IDs for contributors that lack them
  let needsSave = false;
  (data.contributors || []).forEach((c) => {
    if (!c.id && c.name) {
      c.id = c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      needsSave = true;
    }
  });
  if (needsSave) writeData("team", data);

  if (type === "contributor") {
    return NextResponse.json(data.contributors || []);
  }

  // Default: return members (core team)
  return NextResponse.json(data.members || []);
}

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = readData("team");
    const isContributor = body._type === "contributor";
    delete body._type;

    if (isContributor) {
      // Add contributor
      if (!data.contributors) data.contributors = [];
      body.id = body.id || (body.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      data.contributors.push(body);
      writeData("team", data);
      return NextResponse.json(body, { status: 201 });
    }

    // Add core team member
    const member = body;
    if (!member.id) {
      member.id = member.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    if (data.members.find((m) => m.id === member.id)) {
      return NextResponse.json({ error: "Member with this ID already exists" }, { status: 400 });
    }

    member.social = member.social || {};
    member.certifications = member.certifications || [];

    data.members.push(member);
    writeData("team", data);

    return NextResponse.json(member, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}
