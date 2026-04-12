"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroller from "@/components/SmoothScroller";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

gsap.registerPlugin(ScrollTrigger);

const EventDetailHero = dynamic(() => import("@/components/EventDetailHero"), {
  ssr: false,
});

/* ── RSVP Button Component ── */
function RSVPButton({ eventSlug, capacity, className = "" }) {
  const router = useRouter();
  const [status, setStatus] = useState("loading"); // loading | unauthenticated | unregistered | registered
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/registrations/${eventSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) setStatus("unauthenticated");
        else if (data.registered) setStatus("registered");
        else setStatus("unregistered");
      })
      .catch(() => setStatus("unauthenticated"));
  }, [eventSlug]);

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    // After Google auth, redirect to the registration form
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(`/events/${eventSlug}/register`)}`,
      },
    });
    if (error) setError(error.message);
  };

  const handleGoToForm = () => {
    router.push(`/events/${eventSlug}/register`);
  };

  const handleCancel = async () => {
    setStatus("loading");
    const res = await fetch(`/api/registrations/${eventSlug}`, { method: "DELETE" });
    if (res.ok) setStatus("unregistered");
    else setStatus("registered");
  };

  const btnBase = `group relative inline-flex items-center justify-center px-10 py-5 text-sm tracking-[0.15em] font-semibold rounded-full overflow-hidden transition-all duration-500 ${className}`;

  if (status === "loading") {
    return (
      <span className={`${btnBase} text-off-white/30 border border-purple-light/20 cursor-wait`} style={{ fontFamily: "var(--font-display)" }}>
        CHECKING...
      </span>
    );
  }

  if (status === "registered") {
    return (
      <div className="flex flex-col items-start gap-3">
        <span
          className={`${btnBase} text-white shadow-[0_0_20px_rgba(72,187,120,0.3)]`}
          style={{ fontFamily: "var(--font-display)", background: "linear-gradient(135deg, #22543d, #48BB78)" }}
        >
          ✓ REGISTERED
        </span>
        <button
          onClick={handleCancel}
          className="text-[10px] tracking-[0.15em] text-red-400/50 hover:text-red-400 transition-colors ml-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          CANCEL REGISTRATION
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={status === "unauthenticated" ? handleGoogleLogin : handleGoToForm}
        className={`${btnBase} text-white shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]`}
        style={{ fontFamily: "var(--font-display)", background: "linear-gradient(135deg, #6B21A8, #A855F7)" }}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-purple-light to-purple-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="relative z-10 flex items-center gap-3">
          {status === "unauthenticated" && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
          )}
          {status === "unauthenticated" ? "SIGN IN WITH GOOGLE TO RSVP" : "REGISTER FOR EVENT"}
        </span>
      </button>
      {error && <span className="text-xs text-red-400 ml-6">{error}</span>}
      {status === "unauthenticated" && (
        <span className="text-[10px] text-off-white/20 ml-6">Sign in with Google to register for this event</span>
      )}
    </div>
  );
}


export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const titleRef = useRef(null);
  const metaRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    fetch(`/api/events/${params.slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setEvent(data);
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  useEffect(() => {
    if (!event) return;

    const ctx = gsap.context(() => {
      // Title parallax
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          yPercent: -30,
          ease: "none",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 20%",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // Content sections fade in
      const sections = contentRef.current?.querySelectorAll(".reveal-section");
      if (sections) {
        sections.forEach((section) => {
          gsap.from(section, {
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
            },
          });
        });
      }
    });

    return () => ctx.revert();
  }, [event]);

  if (loading) {
    return (
      <SmoothScroller>
        <PageTransition>
          <div className="min-h-screen flex items-center justify-center gradient-hero">
            <div style={{ width: "36px", height: "36px", border: "3px solid rgba(168,85,247,0.2)", borderTopColor: "#A855F7", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        </PageTransition>
      </SmoothScroller>
    );
  }

  if (!event) {
    return (
      <SmoothScroller>
        <PageTransition>
          <div className="min-h-screen flex flex-col items-center justify-center gradient-hero px-6">
            <h1
              className="text-4xl md:text-6xl font-bold text-gradient mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              EVENT NOT FOUND
            </h1>
            <p className="text-off-white/40 mb-8">
              This event doesn&apos;t exist in our universe.
            </p>
            <Link
              href="/events"
              className="px-6 py-3 text-sm tracking-[0.15em] text-purple-light border border-purple-light/30 rounded-full hover:bg-purple-light/10 transition-all"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ← BACK TO EVENTS
            </Link>
          </div>
        </PageTransition>
      </SmoothScroller>
    );
  }

  return (
    <SmoothScroller>
      <PageTransition>
        {/* Hero Section */}
        <section className="relative min-h-screen gradient-hero overflow-hidden">
          <EventDetailHero event={event} />

          <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-3xl">
            {/* Back link */}
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-purple-light/50 hover:text-purple-light transition-colors mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ← ALL EVENTS
            </Link>

            {/* Event type badge */}
            <span
              className="inline-block w-fit px-4 py-1.5 text-[10px] tracking-[0.25em] rounded-full border mb-6"
              style={{
                color: event.color,
                borderColor: `${event.color}40`,
                backgroundColor: `${event.color}10`,
                fontFamily: "var(--font-display)",
              }}
            >
              {event.type}
            </span>

            {/* Title */}
            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl md:text-7xl font-bold text-off-white leading-[1.05] mb-6 glow-text"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {event.title}
            </h1>

            {/* Meta info */}
            <div ref={metaRef} className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 text-sm text-off-white/50">
                <span className="text-purple-light">📅</span>
                {event.date}
              </div>
              <div className="flex items-center gap-2 text-sm text-off-white/50">
                <span className="text-purple-light">📍</span>
                {event.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-off-white/50">
                <span className="text-purple-light">👥</span>
                {event.capacity} seats
              </div>
            </div>

            <p className="text-base md:text-lg text-off-white/40 leading-relaxed max-w-xl mb-10">
              {event.desc}
            </p>

            <RSVPButton eventSlug={event.slug} capacity={event.capacity} />
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
            <span
              className="text-[10px] tracking-[0.3em] text-purple-light/60"
              style={{ fontFamily: "var(--font-display)" }}
            >
              DETAILS BELOW
            </span>
            <div className="w-px h-12 bg-gradient-to-b from-purple-light/60 to-transparent animate-pulse" />
          </div>
        </section>

        {/* Content Sections */}
        <div ref={contentRef} className="relative gradient-section">
          {/* Schedule */}
          <section className="reveal-section max-w-4xl mx-auto px-6 md:px-16 py-20">
            <h2
              className="text-2xl md:text-4xl font-bold text-gradient mb-10"
              style={{ fontFamily: "var(--font-display)" }}
            >
              SCHEDULE
            </h2>
            <div className="space-y-4">
              {event.schedule?.map((item, i) => (
                <div
                  key={i}
                  className="glass-card px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 group hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-shadow duration-500"
                >
                  <span
                    className="text-sm font-bold text-purple-light whitespace-nowrap min-w-[130px]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.time}
                  </span>
                  <div className="hidden sm:block w-px h-5 bg-purple-light/20" />
                  <span className="text-off-white/70">{item.topic}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Event images */}
          {event.images && event.images.length > 0 && (
            <section className="reveal-section max-w-4xl mx-auto px-6 md:px-16 pb-20">
              <h2 className="text-2xl md:text-4xl font-bold text-gradient mb-10" style={{ fontFamily: "var(--font-display)" }}>
                GALLERY
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
                {event.images.map((img, i) => (
                  <img key={i} src={img} alt={`${event.title} image ${i + 1}`} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "12px", border: "1px solid rgba(168,85,247,0.15)" }} />
                ))}
              </div>
            </section>
          )}

          {/* Event videos */}
          {event.videos && event.videos.length > 0 && (
            <section className="reveal-section max-w-4xl mx-auto px-6 md:px-16 pb-20">
              <h2 className="text-2xl md:text-4xl font-bold text-gradient mb-10" style={{ fontFamily: "var(--font-display)" }}>
                VIDEOS
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                {event.videos.map((vid, i) => (
                  <video key={i} src={vid} controls style={{ width: "100%", maxWidth: "640px", borderRadius: "12px", border: "1px solid rgba(168,85,247,0.15)" }} />
                ))}
              </div>
            </section>
          )}

          {/* Prerequisites & Speakers in two columns */}
          <section className="reveal-section max-w-4xl mx-auto px-6 md:px-16 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Prerequisites */}
              <div>
                <h2
                  className="text-2xl md:text-3xl font-bold text-gradient mb-8"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  PREREQUISITES
                </h2>
                <ul className="space-y-3">
                  {event.prerequisites?.map((prereq, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 w-2 h-2 rounded-full bg-purple-light flex-shrink-0" />
                      <span className="text-off-white/60 text-sm leading-relaxed">
                        {prereq}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Speakers */}
              <div>
                <h2
                  className="text-2xl md:text-3xl font-bold text-gradient mb-8"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  SPEAKERS
                </h2>
                <div className="space-y-4">
                  {event.speakers?.map((speaker, i) => (
                    <div key={i} className="glass-card p-5">
                      <h4 className="text-off-white font-semibold mb-1">
                        {speaker.name}
                      </h4>
                      <p className="text-xs text-purple-light/70 mb-2">
                        {speaker.role}
                      </p>
                      <p className="text-sm text-off-white/40">
                        Topic: {speaker.topic}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="reveal-section max-w-4xl mx-auto px-6 md:px-16 pb-24 flex justify-center">
            <div className="glass-card p-10 md:p-16 text-center w-full">
              <h3
                className="text-2xl md:text-4xl font-bold text-gradient mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                READY TO JOIN?
              </h3>
              <p className="text-off-white/40 mb-8 max-w-md mx-auto">
                Secure your spot — seats are limited to {event.capacity} attendees.
              </p>
              <div className="flex justify-center">
                <RSVPButton eventSlug={event.slug} capacity={event.capacity} />
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </PageTransition>
    </SmoothScroller>
  );
}
