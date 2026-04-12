"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";

export default function TeamListPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => setMembers(data.members || []))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    setDeleting(id);
    const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
    if (res.ok) setMembers((prev) => prev.filter((m) => m.id !== id));
    setDeleting(null);
  };

  return (
    <AdminLayout title="TEAM" subtitle="Manage team members">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <span style={{ fontSize: "13px", color: "rgba(245,245,245,0.35)" }}>{members.length} members</span>
        <Link
          href="/admin/dashboard/team/new"
          style={{
            padding: "10px 20px", borderRadius: "10px", background: "linear-gradient(135deg, #6B21A8, #A855F7)",
            color: "#fff", fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.1em",
            textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          ADD MEMBER
        </Link>
      </div>

      <div style={{ background: "rgba(107,33,168,0.06)", border: "1px solid rgba(168,85,247,0.12)", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "60px 2fr 1.5fr 1fr 120px", padding: "14px 24px", borderBottom: "1px solid rgba(168,85,247,0.1)", fontSize: "10px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: "rgba(245,245,245,0.3)" }}>
          <span></span><span>NAME</span><span>ROLE</span><span>CERTS</span><span style={{ textAlign: "right" }}>ACTIONS</span>
        </div>

        {loading && <div style={{ padding: "40px", textAlign: "center", color: "rgba(245,245,245,0.3)", fontSize: "13px" }}>Loading...</div>}
        {!loading && members.length === 0 && <div style={{ padding: "40px", textAlign: "center", color: "rgba(245,245,245,0.3)", fontSize: "13px" }}>No members yet</div>}

        {members.map((m) => (
          <div
            key={m.id}
            style={{ display: "grid", gridTemplateColumns: "60px 2fr 1.5fr 1fr 120px", padding: "16px 24px", borderBottom: "1px solid rgba(168,85,247,0.06)", alignItems: "center", transition: "background 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(168,85,247,0.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `${m.color}20`, border: `1px solid ${m.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600, color: m.color }}>{m.avatar}</div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 500, color: "#F5F5F5" }}>{m.name}</div>
              <div style={{ fontSize: "11px", color: "rgba(245,245,245,0.3)", marginTop: "2px" }}>{m.tagline}</div>
            </div>
            <span style={{ fontSize: "13px", color: "rgba(245,245,245,0.5)" }}>{m.role}</span>
            <span style={{ fontSize: "12px", color: "rgba(245,245,245,0.4)" }}>{m.certifications?.length || 0}</span>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button onClick={() => router.push(`/admin/dashboard/team/${m.id}`)} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(168,85,247,0.2)", background: "transparent", color: "#A855F7", fontSize: "11px", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(168,85,247,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >Edit</button>
              <button onClick={() => handleDelete(m.id)} disabled={deleting === m.id} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(245,100,100,0.2)", background: "transparent", color: "rgba(245,100,100,0.7)", fontSize: "11px", cursor: "pointer", transition: "all 0.2s", opacity: deleting === m.id ? 0.5 : 1 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(245,100,100,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >{deleting === m.id ? "..." : "Delete"}</button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
