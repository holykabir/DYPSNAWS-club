"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import SmoothScroller from "@/components/SmoothScroller";
import Loader from "@/components/Loader";
import Hero from "@/components/Hero";
import TeamSection from "@/components/TeamSection";
import EventsSection from "@/components/EventsSection";
import CertificationsSection from "@/components/CertificationsSection";
import Footer from "@/components/Footer";

// Dynamically import 3D canvas to avoid SSR issues
const HeroCanvas = dynamic(() => import("@/components/HeroCanvas"), {
  ssr: false,
});

export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false);

  const handleLoaderComplete = useCallback(() => {
    setLoaderDone(true);
  }, []);

  return (
    <SmoothScroller>
      <Loader onComplete={handleLoaderComplete} />

      <main className="relative">
        {/* Hero with 3D background */}
        <div className="relative">
          <HeroCanvas />
          <Hero />
        </div>

        {/* Core Team */}
        <TeamSection />

        {/* Events 3D Stack */}
        <EventsSection />

        {/* Certifications */}
        <CertificationsSection />

        {/* Footer */}
        <Footer />
      </main>
    </SmoothScroller>
  );
}
