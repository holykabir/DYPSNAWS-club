import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readData, writeData } from "@/lib/dataStore";

export async function GET() {
  const certs = readData("certifications");
  return NextResponse.json(certs);
}

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cert = await request.json();
    const certs = readData("certifications");

    if (!cert.id) {
      cert.id = cert.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    if (certs.find((c) => c.id === cert.id)) {
      return NextResponse.json({ error: "Certification with this ID already exists" }, { status: 400 });
    }

    cert.topics = cert.topics || [];

    certs.push(cert);
    writeData("certifications", certs);

    return NextResponse.json(cert, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create certification" }, { status: 500 });
  }
}
