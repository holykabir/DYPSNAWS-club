"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";

function StatCard({ label, value, icon, color, href }) {
  return (
    <Link
      href={href}
      style={{
        background: "rgba(107,33,168,0.06)",
        border: "1px solid rgba(168,85,247,0.12)",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        textDecoration: "none",
        transition: "all 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)";
        e.currentTarget.style.boxShadow = "0 0 30px rgba(168,85,247,0.08)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(168,85,247,0.12)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "28px", fontWeight: 700, color: "#F5F5F5", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: "12px", color: "rgba(245,245,245,0.4)", marginTop: "4px", letterSpacing: "0.05em" }}>{label}</div>
      </div>
    </Link>
  );
}

function RecentItem({ title, subtitle, type, color }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid rgba(168,85,247,0.06)",
      }}
    >
      <div>
        <div style={{ fontSize: "14px", color: "#F5F5F5", fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: "12px", color: "rgba(245,245,245,0.35)", marginTop: "2px" }}>{subtitle}</div>
      </div>
      <span
        style={{
          padding: "3px 10px",
          borderRadius: "999px",
          fontSize: "10px",
          fontFamily: "var(--font-display)",
          letterSpacing: "0.1em",
          color: color,
          border: `1px solid ${color}40`,
          background: `${color}12`,
        }}
      >
        {type}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ events: 0, members: 0, contributors: 0, certifications: 0 });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/events").then((r) => r.json()),
      fetch("/api/team").then((r) => r.json()),
      fetch("/api/team?type=contributor").then((r) => r.json()),
      fetch("/api/certifications").then((r) => r.json()),
    ]).then(([evts, members, contribs, certs]) => {
      setEvents(evts.slice(0, 5));
      setStats({
        events: evts.length,
        members: Array.isArray(members) ? members.length : 0,
        contributors: Array.isArray(contribs) ? contribs.length : 0,
        certifications: certs.length,
      });
    });
  }, []);

  return (
    <AdminLayout title="DASHBOARD" subtitle="Overview of your AWS Cloud Club website">
      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "40px" }}>
        <StatCard
          label="Total Events"
          value={stats.events}
          color="#A855F7"
          href="/admin/dashboard/events"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
        />
        <StatCard
          label="Team Members"
          value={stats.members + stats.contributors}
          color="#7C3AED"
          href="/admin/dashboard/team"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <StatCard
          label="Certifications"
          value={stats.certifications}
          color="#9333EA"
          href="/admin/dashboard/certifications"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
          }
        />
      </div>

      {/* Recent events */}
      <div
        style={{
          background: "rgba(107,33,168,0.06)",
          border: "1px solid rgba(168,85,247,0.12)",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#F5F5F5", fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}>
            RECENT EVENTS
          </h2>
          <Link
            href="/admin/dashboard/events"
            style={{
              fontSize: "11px",
              color: "#A855F7",
              textDecoration: "none",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.1em",
            }}
          >
            VIEW ALL →
          </Link>
        </div>
        {events.map((event) => (
          <RecentItem
            key={event.slug}
            title={event.title}
            subtitle={event.date}
            type={event.type}
            color={event.color}
          />
        ))}
        {events.length === 0 && (
          <p style={{ fontSize: "13px", color: "rgba(245,245,245,0.3)", padding: "20px 0", textAlign: "center" }}>
            No events yet
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
