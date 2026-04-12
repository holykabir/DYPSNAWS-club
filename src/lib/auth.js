import { createClient } from "@/lib/supabase/server";

/**
 * Check if a given email matches the admin email
 */
export function isAdmin(email) {
  return email === (process.env.ADMIN_EMAIL || "admin@awsclub.dyp");
}

/**
 * Get authenticated user from Supabase, verify admin role.
 * Returns the user object if admin, or null.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user || !isAdmin(user.email)) {
    return null;
  }

  return user;
}

/**
 * Get authenticated user from Supabase (any user).
 * Returns the user object or null.
 */
export async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}
