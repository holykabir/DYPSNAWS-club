import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readData, writeData } from "@/lib/dataStore";

export async function GET() {
  const data = readData("team");
  return NextResponse.json(data);
}

export async function POST(request) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const member = await request.json();
    const data = readData("team");

    // Generate id from name if not provided
    if (!member.id) {
      member.id = member.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Check for duplicate id
    if (data.members.find((m) => m.id === member.id)) {
      return NextResponse.json({ error: "Member with this ID already exists" }, { status: 400 });
    }

    // Set defaults
    member.social = member.social || {};
    member.certifications = member.certifications || [];

    data.members.push(member);
    writeData("team", data);

    return NextResponse.json(member, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}
