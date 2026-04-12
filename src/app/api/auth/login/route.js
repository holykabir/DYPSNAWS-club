import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Check if admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@awsclub.dyp";
    if (data.user.email !== adminEmail) {
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "This account is not authorized for admin access" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      email: data.user.email,
    });
  } catch (err) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
