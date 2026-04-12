import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { ensureUploadsDir } from "@/lib/dataStore";
import fs from "fs";
import path from "path";

export async function POST(request) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uploadsDir = ensureUploadsDir();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const ext = path.extname(file.name);
    const baseName = path.basename(file.name, ext).replace(/[^a-z0-9-_]/gi, "_");
    const uniqueName = `${baseName}_${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    fs.writeFileSync(filePath, buffer);

    const url = `/uploads/${uniqueName}`;
    return NextResponse.json({ success: true, url, filename: uniqueName });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
