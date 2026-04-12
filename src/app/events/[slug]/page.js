"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroller from "@/components/SmoothScroller";
import PageTransition from "@/components/PageTransition";
import MagneticButton from "@/components/MagneticButton";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

const EventDetailHero = dynamic(() => import("@/components/EventDetailHero"), {
  ssr: false,
});

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

            <MagneticButton href="#">RSVP / REGISTER</MagneticButton>
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
          <section className="reveal-section max-w-4xl mx-auto px-6 md:px-16 pb-24 text-center">
            <div className="glass-card p-10 md:p-16">
              <h3
                className="text-2xl md:text-4xl font-bold text-gradient mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                READY TO JOIN?
              </h3>
              <p className="text-off-white/40 mb-8 max-w-md mx-auto">
                Secure your spot — seats are limited to {event.capacity} attendees.
              </p>
              <MagneticButton href="#">RSVP / REGISTER</MagneticButton>
            </div>
          </section>
        </div>

        <Footer />
      </PageTransition>
    </SmoothScroller>
  );
}
