import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect admin dashboard routes
  if (request.nextUrl.pathname.startsWith("/admin/dashboard")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    // Check if user is admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@awsclub.dyp";
    if (user.email !== adminEmail) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }
  }

  // Protect event registration routes
  if (request.nextUrl.pathname.match(/^\/events\/[^/]+\/register$/)) {
    if (!user) {
      // Redirect to the event page with a login prompt
      const url = request.nextUrl.clone();
      url.pathname = url.pathname.replace("/register", "");
      url.searchParams.set("login", "required");
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|uploads/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
