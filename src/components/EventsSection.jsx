"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

gsap.registerPlugin(ScrollTrigger);

const EventStack3D = dynamic(() => import("./EventStack3D"), { ssr: false });

export default function EventsSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [isMobile, setIsMobile] = useState(null); // null = not determined yet

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative gradient-events"
      id="events"
    >
      {/* Top title area */}
      <div className="py-20 md:py-28 text-center px-6">
        <div ref={titleRef}>
          <span
            className="inline-block text-xs tracking-[0.3em] text-purple-light/60 mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            WHAT&apos;S HAPPENING
          </span>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            EVENTS
          </h2>
          <p className="text-off-white/40 max-w-lg mx-auto">
            Scroll through our upcoming and ongoing events. Hover to explore.
          </p>
        </div>
      </div>

      {/* Wait for client-side hydration before rendering */}
      {isMobile === null ? (
        <div className="h-64" />
      ) : isMobile ? (
        <div className="pb-16">
          <EventStack3D />
        </div>
      ) : (
        <div className="relative h-[300vh]">
          <div className="sticky top-0 h-screen w-full">
            <EventStack3D />
          </div>
        </div>
      )}
    </section>
  );
}
