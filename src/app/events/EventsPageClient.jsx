"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import SmoothScroller from "@/components/SmoothScroller";
import PageTransition from "@/components/PageTransition";

/* ── tiny star-field built with pure CSS ── */
function Starfield() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      opacity: Math.random() * 0.6 + 0.1,
    }));
    setStars(generated);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((s) => (
        <span
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: "50%",
            backgroundColor: "#C084FC",
            opacity: s.opacity,
            animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

/* ── single event card ── */
function EventCard({ event, index }) {
  const router = useRouter();
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 12,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * -12,
    });
  };

  const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });

  const typeColors = {
    WORKSHOP: { bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.35)", badge: "#A855F7" },
    HACKATHON: { bg: "rgba(124,58,237,0.12)", border: "rgba(124,58,237,0.35)", badge: "#7C3AED" },
    CERTIFICATION: { bg: "rgba(147,51,234,0.12)", border: "rgba(147,51,234,0.35)", badge: "#9333EA" },
    SUMMIT: { bg: "rgba(192,132,252,0.12)", border: "rgba(192,132,252,0.35)", badge: "#C084FC" },
    FESTIVAL: { bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.35)", badge: "#8B5CF6" },
  };

  const tc = typeColors[event.type] || typeColors.WORKSHOP;

  return (
    <div
      ref={cardRef}
      onClick={() => router.push(`/events/${event.slug}`)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? `perspective(800px) rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg) translateY(0)`
          : "perspective(800px) translateY(60px)",
        transition: `opacity 0.7s cubic-bezier(.16,1,.3,1) ${index * 0.1}s, transform 0.7s cubic-bezier(.16,1,.3,1) ${index * 0.1}s`,
        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          position: "relative",
          background: tc.bg,
          border: `1px solid ${tc.border}`,
          borderRadius: "20px",
          padding: "32px",
          backdropFilter: "blur(16px)",
          overflow: "hidden",
          transition: "border-color 0.3s, box-shadow 0.3s, background 0.3s",
        }}
        className="event-card-inner"
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = event.color;
          e.currentTarget.style.boxShadow = `0 0 30px ${event.color}33, 0 8px 32px rgba(0,0,0,0.4)`;
          e.currentTarget.style.background = tc.bg.replace("0.12", "0.2");
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = tc.border;
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.background = tc.bg;
        }}
      >
        {/* Gradient orb decoration */}
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${event.color}22 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* Type badge */}
        <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              display: "inline-block",
              padding: "4px 14px",
              borderRadius: "999px",
              fontSize: "10px",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.15em",
              color: tc.badge,
              border: `1px solid ${tc.badge}55`,
              background: `${tc.badge}15`,
            }}
          >
            {event.type}
          </span>
          <span
            style={{
              fontSize: "12px",
              color: "#A855F7",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.05em",
            }}
          >
            {event.date}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: "clamp(1.25rem, 2vw, 1.75rem)", fontWeight: 700, color: "#F5F5F5", marginBottom: "12px", lineHeight: 1.2 }}>
          {event.title}
        </h3>

        {/* Description */}
        <p style={{ fontSize: "14px", lineHeight: 1.6, color: "rgba(245,245,245,0.5)", marginBottom: "20px" }}>
          {event.desc}
        </p>

        {/* Meta row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "rgba(245,245,245,0.35)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              {event.location}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "rgba(245,245,245,0.35)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              {event.capacity} seats
            </span>
          </div>
          <span style={{ fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.1em", color: event.color, display: "flex", alignItems: "center", gap: "6px" }} className="explore-cta">
            EXPLORE
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Filter pills ── */
function FilterPills({ active, onChange, types }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginBottom: "48px" }}>
      {["ALL", ...types].map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          style={{
            padding: "8px 20px", borderRadius: "999px", fontSize: "11px",
            fontFamily: "var(--font-display)", letterSpacing: "0.12em", cursor: "pointer",
            border: `1px solid ${active === t ? "#A855F7" : "rgba(168,85,247,0.2)"}`,
            background: active === t ? "rgba(168,85,247,0.2)" : "transparent",
            color: active === t ? "#C084FC" : "rgba(245,245,245,0.4)",
            transition: "all 0.3s",
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/* ── Main page ── */
export default function EventsPageClient() {
  const [filter, setFilter] = useState("ALL");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const types = [...new Set(events.map((e) => e.type))];
  const filtered = filter === "ALL" ? events : events.filter((e) => e.type === filter);

  return (
    <SmoothScroller>
      <PageTransition>
        <Starfield />

        {/* Gradient background */}
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(107,33,168,0.25) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(168,85,247,0.08) 0%, transparent 50%), #0A0A0F",
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Hero header */}
          <div style={{ paddingTop: "120px", paddingBottom: "48px", textAlign: "center", paddingLeft: "24px", paddingRight: "24px" }}>
            <span style={{ display: "inline-block", fontSize: "11px", letterSpacing: "0.3em", color: "rgba(168,85,247,0.5)", marginBottom: "16px", fontFamily: "var(--font-display)" }}>
              EXPLORE THE NEBULA
            </span>
            <h1 className="text-gradient glow-text" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: "16px", lineHeight: 1 }}>
              EVENTS
            </h1>
            <p style={{ color: "rgba(245,245,245,0.4)", maxWidth: "480px", margin: "0 auto 32px", fontSize: "15px", lineHeight: 1.6 }}>
              Navigate through our universe of events. Filter by type, hover to preview, click to explore.
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{ width: "32px", height: "1px", background: "rgba(168,85,247,0.2)" }} />
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#A855F7", boxShadow: "0 0 12px #A855F7" }} />
              <div style={{ width: "32px", height: "1px", background: "rgba(168,85,247,0.2)" }} />
            </div>
          </div>

          {/* Filters */}
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
            <FilterPills active={filter} onChange={setFilter} types={types} />

            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span style={{ fontSize: "12px", color: "rgba(245,245,245,0.25)", fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}>
                {loading ? "LOADING..." : `${filtered.length} EVENT${filtered.length !== 1 ? "S" : ""}`}
              </span>
            </div>

            {/* Events grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 480px), 1fr))", gap: "28px", paddingBottom: "80px" }}>
              {filtered.map((event, i) => (
                <EventCard key={event.slug} event={event} index={i} />
              ))}
            </div>

            {!loading && filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(245,245,245,0.3)" }}>
                <p style={{ fontSize: "18px", marginBottom: "8px" }}>No events found</p>
                <p style={{ fontSize: "13px" }}>Try a different filter</p>
              </div>
            )}
          </div>

          <Footer />
        </div>

        <style>{`
          @keyframes twinkle {
            0% { opacity: 0.1; transform: scale(0.8); }
            100% { opacity: 0.7; transform: scale(1.2); }
          }
          .event-card-inner:hover .explore-cta {
            gap: 10px !important;
          }
        `}</style>
      </PageTransition>
    </SmoothScroller>
  );
}
