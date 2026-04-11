"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import EventStack3D from "./EventStack3D";

gsap.registerPlugin(ScrollTrigger);

export default function EventsSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
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

    return () => ctx.revert();
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

      {/* 3D Event Stack Canvas — pinned on scroll */}
      <div className="relative h-[300vh]">
        <div className="sticky top-0 h-screen w-full">
          <EventStack3D />
        </div>
      </div>
    </section>
  );
}
