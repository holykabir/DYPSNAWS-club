"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";

export default function CertsListPage() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/certifications")
      .then((r) => r.json())
      .then((data) => setCerts(data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this certification?")) return;
    setDeleting(id);
    const res = await fetch(`/api/certifications/${id}`, { method: "DELETE" });
    if (res.ok) setCerts((prev) => prev.filter((c) => c.id !== id));
    setDeleting(null);
  };

  const levelColor = { Foundational: "#A855F7", Associate: "#7C3AED", Professional: "#9333EA", Specialty: "#C084FC" };

  return (
    <AdminLayout title="CERTIFICATIONS" subtitle="Manage AWS certifications">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <span style={{ fontSize: "13px", color: "rgba(245,245,245,0.35)" }}>{certs.length} certifications</span>
        <Link
          href="/admin/dashboard/certifications/new"
          style={{
            padding: "10px 20px", borderRadius: "10px", background: "linear-gradient(135deg, #6B21A8, #A855F7)",
            color: "#fff", fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.1em",
            textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          ADD CERTIFICATION
        </Link>
      </div>

      <div style={{ background: "rgba(107,33,168,0.06)", border: "1px solid rgba(168,85,247,0.12)", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 120px", padding: "14px 24px", borderBottom: "1px solid rgba(168,85,247,0.1)", fontSize: "10px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: "rgba(245,245,245,0.3)" }}>
          <span>CERTIFICATION</span><span>CODE</span><span>LEVEL</span><span>DURATION</span><span style={{ textAlign: "right" }}>ACTIONS</span>
        </div>

        {loading && <div style={{ padding: "40px", textAlign: "center", color: "rgba(245,245,245,0.3)", fontSize: "13px" }}>Loading...</div>}
        {!loading && certs.length === 0 && <div style={{ padding: "40px", textAlign: "center", color: "rgba(245,245,245,0.3)", fontSize: "13px" }}>No certifications yet</div>}

        {certs.map((cert) => (
          <div
            key={cert.id}
            style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 120px", padding: "16px 24px", borderBottom: "1px solid rgba(168,85,247,0.06)", alignItems: "center", transition: "background 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(168,85,247,0.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div>
              <div style={{ fontSize: "14px", fontWeight: 500, color: "#F5F5F5" }}>{cert.name}</div>
              <div style={{ fontSize: "11px", color: "rgba(245,245,245,0.3)", marginTop: "2px" }}>{cert.topics?.length || 0} topics</div>
            </div>
            <span style={{ fontSize: "13px", color: "rgba(245,245,245,0.5)", fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>{cert.code}</span>
            <span style={{ display: "inline-block", width: "fit-content", padding: "3px 10px", borderRadius: "999px", fontSize: "10px", fontFamily: "var(--font-display)", letterSpacing: "0.1em", color: levelColor[cert.level] || "#A855F7", border: `1px solid ${(levelColor[cert.level] || "#A855F7")}40`, background: `${levelColor[cert.level] || "#A855F7"}12` }}>{cert.level}</span>
            <span style={{ fontSize: "13px", color: "rgba(245,245,245,0.5)" }}>{cert.duration}</span>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button onClick={() => router.push(`/admin/dashboard/certifications/${cert.id}`)} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(168,85,247,0.2)", background: "transparent", color: "#A855F7", fontSize: "11px", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(168,85,247,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >Edit</button>
              <button onClick={() => handleDelete(cert.id)} disabled={deleting === cert.id} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(245,100,100,0.2)", background: "transparent", color: "rgba(245,100,100,0.7)", fontSize: "11px", cursor: "pointer", opacity: deleting === cert.id ? 0.5 : 1 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(245,100,100,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >{deleting === cert.id ? "..." : "Delete"}</button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
