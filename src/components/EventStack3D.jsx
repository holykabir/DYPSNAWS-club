"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

/* ── Mobile Event Card ── */
function MobileEventCard({ event }) {
  const status = event.status || "Upcoming";
  const sc = status === "Completed" ? { c: "#22c55e", bg: "rgba(34,197,94,0.12)", b: "rgba(34,197,94,0.3)" }
    : status === "Ongoing" ? { c: "#f59e0b", bg: "rgba(245,158,11,0.12)", b: "rgba(245,158,11,0.3)" }
    : { c: "#3b82f6", bg: "rgba(59,130,246,0.12)", b: "rgba(59,130,246,0.3)" };

  return (
    <Link
      href={`/events/${event.slug}`}
      className="block glass-card p-6 hover:scale-[1.02] transition-all duration-300 relative"
      style={{ boxShadow: `0 0 25px ${event.color || "#A855F7"}15` }}
    >
      {/* Status badge */}
      <span
        style={{
          position: "absolute", top: "12px", right: "12px",
          padding: "3px 10px", borderRadius: "999px", fontSize: "9px",
          fontFamily: "var(--font-display)", letterSpacing: "0.1em", fontWeight: 600,
          color: sc.c, background: sc.bg, border: `1px solid ${sc.b}`,
        }}
      >
        {status.toUpperCase()}
      </span>

      <span
        className="inline-block text-[10px] tracking-[0.2em] mb-2"
        style={{ color: event.color || "#A855F7", fontFamily: "var(--font-display)" }}
      >
        {event.type}
      </span>
      <h3 className="text-lg font-bold text-off-white mb-2">{event.title}</h3>
      <div className="flex flex-wrap gap-4 text-xs text-off-white/40 mb-3">
        <span>📅 {event.date}</span>
        {event.location && <span>📍 {event.location}</span>}
      </div>
      <p className="text-sm text-off-white/30 line-clamp-2">{event.desc}</p>
      <span
        className="inline-block mt-4 text-xs tracking-[0.15em]"
        style={{ color: event.color || "#A855F7", fontFamily: "var(--font-display)" }}
      >
        VIEW EVENT →
      </span>
    </Link>
  );
}

/* ── Desktop 3D Stack — separate component to avoid require() in render ── */
const Desktop3DStack = dynamic(() => import("./EventStack3DDesktop"), { ssr: false });

export default function EventStack3D({ events: propEvents }) {
  const [events, setEvents] = useState([]);
  const [isMobile, setIsMobile] = useState(null); // null = not yet determined

  useEffect(() => {
    // Determine mobile on client only
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Load only featured events for homepage
    fetch("/api/events?featured=true")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setEvents(data);
      })
      .catch(() => {});
  }, []);

  // Don't render until mobile state is known (prevents flicker/hydration mismatch)
  if (isMobile === null) return null;

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-off-white/30 text-sm">
        No events yet
      </div>
    );
  }

  // Mobile: show card list
  if (isMobile) {
    return (
      <div className="px-6 py-12 space-y-4 max-w-xl mx-auto">
        {events.map((event) => (
          <MobileEventCard key={event.slug} event={event} />
        ))}
        <div className="text-center pt-4">
          <Link
            href="/events"
            className="text-xs tracking-[0.2em] text-purple-light/50 hover:text-purple-light transition-colors"
            style={{ fontFamily: "var(--font-display)" }}
          >
            VIEW ALL EVENTS →
          </Link>
        </div>
      </div>
    );
  }

  // Desktop: 3D stack (dynamically imported, no SSR)
  return <Desktop3DStack events={events} />;
}
