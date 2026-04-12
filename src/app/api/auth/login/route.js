import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/dataStore";
import { verifyPassword, createToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const admin = getAdmin();

    if (email !== admin.email || !verifyPassword(password, admin.passwordHash)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = createToken({ email: admin.email, role: "admin" }, admin.secret);

    const response = NextResponse.json({ success: true, email: admin.email });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
