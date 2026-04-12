import { NextResponse } from "next/server";
import { getSession, hashPassword, verifyPassword } from "@/lib/auth";
import { getAdmin, setAdmin } from "@/lib/dataStore";

export async function PUT(request) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newEmail, newPassword } = await request.json();
    const admin = getAdmin();

    // Verify current password
    if (!verifyPassword(currentPassword, admin.passwordHash)) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    // Update credentials
    const updated = { ...admin };
    if (newEmail) updated.email = newEmail;
    if (newPassword) updated.passwordHash = hashPassword(newPassword);

    setAdmin(updated);

    return NextResponse.json({ success: true, message: "Credentials updated successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update credentials" }, { status: 500 });
  }
}
