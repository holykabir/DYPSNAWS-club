"use client";

import dynamic from "next/dynamic";
import SmoothScroller from "@/components/SmoothScroller";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";

const EventNebula3D = dynamic(() => import("@/components/EventNebula3D"), {
  ssr: false,
});

export default function EventsPageClient() {
  return (
    <SmoothScroller>
      <PageTransition>
        {/* 3D Nebula Background */}
        <EventNebula3D />

        {/* Page header */}
        <div className="relative z-10 pt-32 pb-16 text-center px-6">
          <span
            className="inline-block text-xs tracking-[0.3em] text-purple-light/60 mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            EXPLORE THE NEBULA
          </span>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-gradient glow-text mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            EVENTS
          </h1>
          <p className="text-off-white/40 max-w-lg mx-auto mb-4">
            Navigate through our universe of events. Hover to preview, click to explore.
          </p>
          <div className="flex items-center justify-center gap-3 text-xs text-purple-light/30 tracking-[0.15em]" style={{ fontFamily: "var(--font-display)" }}>
            <div className="w-8 h-px bg-purple-light/20" />
            SCROLL TO TRAVEL
            <div className="w-8 h-px bg-purple-light/20" />
          </div>
        </div>

        {/* Scroll space for camera movement */}
        <div className="relative z-10 h-[250vh]" />

        <div className="relative z-10">
          <Footer />
        </div>
      </PageTransition>
    </SmoothScroller>
  );
}
