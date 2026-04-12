import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@awsclub.dyp";
  const isAdmin = user.email === adminEmail;

  return NextResponse.json({
    authenticated: true,
    email: user.email,
    isAdmin,
    name: user.user_metadata?.full_name || user.user_metadata?.name || null,
    avatar: user.user_metadata?.avatar_url || null,
  });
}
