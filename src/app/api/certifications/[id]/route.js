import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readData, writeData } from "@/lib/dataStore";

export async function GET(request, { params }) {
  const { id } = await params;
  const certs = readData("certifications");
  const cert = certs.find((c) => c.id === id);
  if (!cert) {
    return NextResponse.json({ error: "Certification not found" }, { status: 404 });
  }
  return NextResponse.json(cert);
}

export async function PUT(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const updates = await request.json();
    const certs = readData("certifications");
    const index = certs.findIndex((c) => c.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 });
    }

    certs[index] = { ...certs[index], ...updates };
    writeData("certifications", certs);

    return NextResponse.json(certs[index]);
  } catch (err) {
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
    const certs = readData("certifications");
    const filtered = certs.filter((c) => c.id !== id);

    if (filtered.length === certs.length) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 });
    }

    writeData("certifications", filtered);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 });
  }
}
