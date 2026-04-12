"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in hero content
      gsap.from([titleRef.current, subtitleRef.current, ctaRef.current], {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        delay: 3.2,
      });

      // Parallax on scroll
      gsap.to(titleRef.current, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(subtitleRef.current, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center gradient-hero overflow-hidden"
      id="hero"
    >
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-deep/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-light/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div ref={subtitleRef} className="mb-6">
          <span
            className="inline-block px-4 py-2 text-xs md:text-sm tracking-[0.3em] text-purple-light/80 border border-purple-light/20 rounded-full backdrop-blur-sm"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ✦ WELCOME TO D.Y PATIL SALONKHENAGAR'S ✦
          </span>
        </div>

        <h1
          ref={titleRef}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tight mb-8 glow-text"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="block text-off-white">AWS</span>
          <span className="block text-gradient">CLOUD</span>
          <span className="block text-off-white">CLUBS</span>
        </h1>

        <p className="text-base md:text-lg text-off-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
          Building the next generation of cloud architects, one deployment at a
          time. Learn, build, and certify with us.
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/events"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-sm tracking-[0.15em] font-semibold text-white bg-purple-deep hover:bg-purple-light transition-all duration-500 rounded-full overflow-hidden"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="relative z-10">EXPLORE EVENTS</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-light to-purple-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
          <Link
            href="/team"
            className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-[0.15em] font-semibold text-purple-light border border-purple-light/30 hover:border-purple-light/60 hover:bg-purple-light/5 transition-all duration-500 rounded-full"
            style={{ fontFamily: "var(--font-display)" }}
          >
            MEET THE TEAM
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-[10px] tracking-[0.3em] text-purple-light/60" style={{ fontFamily: "var(--font-display)" }}>SCROLL</span>
        <div className="w-px h-12 bg-gradient-to-b from-purple-light/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
