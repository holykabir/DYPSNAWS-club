"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        router.replace("/admin");
        return;
      }
      // Check admin email
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@awsclub.dyp";
      // We don't expose admin email on client — just check via API
      fetch("/api/auth/me")
        .then((r) => r.json())
        .then((data) => {
          if (data.isAdmin) {
            setAuthed(true);
          } else {
            router.replace("/admin");
          }
        })
        .catch(() => router.replace("/admin"))
        .finally(() => setLoading(false));
    });
  }, [router]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0F",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            border: "3px solid rgba(168,85,247,0.2)",
            borderTopColor: "#A855F7",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!authed) return null;
  return <>{children}</>;
}
