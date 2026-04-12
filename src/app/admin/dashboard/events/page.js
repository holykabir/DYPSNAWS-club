"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";

export default function EventsListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => setEvents(data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (slug) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setDeleting(slug);
    const res = await fetch(`/api/events/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setEvents((prev) => prev.filter((e) => e.slug !== slug));
    }
    setDeleting(null);
  };

  return (
    <AdminLayout title="EVENTS" subtitle="Manage all club events">
      {/* Header bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <span style={{ fontSize: "13px", color: "rgba(245,245,245,0.35)" }}>{events.length} events total</span>
        <Link
          href="/admin/dashboard/events/new"
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #6B21A8, #A855F7)",
            color: "#fff",
            fontSize: "12px",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.1em",
            textDecoration: "none",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.3s",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          ADD EVENT
        </Link>
      </div>

      {/* Table */}
      <div
        style={{
          background: "rgba(107,33,168,0.06)",
          border: "1px solid rgba(168,85,247,0.12)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 120px",
            padding: "14px 24px",
            borderBottom: "1px solid rgba(168,85,247,0.1)",
            fontSize: "10px",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.15em",
            color: "rgba(245,245,245,0.3)",
          }}
        >
          <span>EVENT</span>
          <span>TYPE</span>
          <span>DATE</span>
          <span>CAPACITY</span>
          <span style={{ textAlign: "right" }}>ACTIONS</span>
        </div>

        {/* Rows */}
        {loading && (
          <div style={{ padding: "40px", textAlign: "center", color: "rgba(245,245,245,0.3)", fontSize: "13px" }}>
            Loading...
          </div>
        )}
        {!loading && events.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "rgba(245,245,245,0.3)", fontSize: "13px" }}>
            No events yet. Add your first event!
          </div>
        )}
        {events.map((event) => (
          <div
            key={event.slug}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 120px",
              padding: "16px 24px",
              borderBottom: "1px solid rgba(168,85,247,0.06)",
              alignItems: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(168,85,247,0.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div>
              <div style={{ fontSize: "14px", fontWeight: 500, color: "#F5F5F5" }}>{event.title}</div>
              <div style={{ fontSize: "11px", color: "rgba(245,245,245,0.3)", marginTop: "2px" }}>{event.location}</div>
            </div>
            <span
              style={{
                display: "inline-block",
                width: "fit-content",
                padding: "3px 10px",
                borderRadius: "999px",
                fontSize: "10px",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.1em",
                color: event.color,
                border: `1px solid ${event.color}40`,
                background: `${event.color}12`,
              }}
            >
              {event.type}
            </span>
            <span style={{ fontSize: "13px", color: "rgba(245,245,245,0.5)" }}>{event.date}</span>
            <span style={{ fontSize: "13px", color: "rgba(245,245,245,0.5)" }}>{event.capacity}</span>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button
                onClick={() => router.push(`/admin/dashboard/events/${event.slug}`)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(168,85,247,0.2)",
                  background: "transparent",
                  color: "#A855F7",
                  fontSize: "11px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(168,85,247,0.1)";
                  e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(168,85,247,0.2)";
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event.slug)}
                disabled={deleting === event.slug}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(245,100,100,0.2)",
                  background: "transparent",
                  color: "rgba(245,100,100,0.7)",
                  fontSize: "11px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  opacity: deleting === event.slug ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(245,100,100,0.1)";
                  e.currentTarget.style.borderColor = "rgba(245,100,100,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(245,100,100,0.2)";
                }}
              >
                {deleting === event.slug ? "..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
