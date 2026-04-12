import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readData, writeData } from "@/lib/dataStore";

export async function GET(request, { params }) {
  const { id } = await params;
  const data = readData("team");
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "contributor") {
    const contributor = (data.contributors || []).find((c) => c.id === id);
    if (!contributor) return NextResponse.json({ error: "Contributor not found" }, { status: 404 });
    return NextResponse.json(contributor);
  }

  const member = data.members.find((m) => m.id === id);
  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
  return NextResponse.json(member);
}

export async function PUT(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const updates = await request.json();
    const data = readData("team");
    const isContributor = updates._type === "contributor";
    delete updates._type;

    if (isContributor) {
      if (!data.contributors) data.contributors = [];
      const index = data.contributors.findIndex((c) => c.id === id);
      if (index === -1) return NextResponse.json({ error: "Contributor not found" }, { status: 404 });
      
      data.contributors[index] = { ...data.contributors[index], ...updates };
      writeData("team", data);
      return NextResponse.json(data.contributors[index]);
    }

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
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = readData("team");
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "contributor") {
      if (!data.contributors) data.contributors = [];
      const filtered = data.contributors.filter((c) => c.id !== id);
      if (filtered.length === data.contributors.length) return NextResponse.json({ error: "Contributor not found" }, { status: 404 });
      data.contributors = filtered;
      writeData("team", data);
      return NextResponse.json({ success: true });
    }

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
