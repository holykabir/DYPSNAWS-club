import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readData, writeData } from "@/lib/dataStore";

export async function GET(request, { params }) {
  const { id } = await params;
  const data = readData("team");
  const member = data.members.find((m) => m.id === id);
  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
  return NextResponse.json(member);
}

export async function PUT(request, { params }) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const updates = await request.json();
    const data = readData("team");
    const index = data.members.findIndex((m) => m.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    data.members[index] = { ...data.members[index], ...updates };
    writeData("team", data);

    return NextResponse.json(data.members[index]);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = readData("team");
    const filtered = data.members.filter((m) => m.id !== id);

    if (filtered.length === data.members.length) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    data.members = filtered;
    writeData("team", data);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
