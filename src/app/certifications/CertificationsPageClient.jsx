"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroller from "@/components/SmoothScroller";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import { CERTIFICATIONS } from "@/data/certifications";

gsap.registerPlugin(ScrollTrigger);

function CertCard({ cert, index }) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const [transform, setTransform] = useState("");
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 80,
        opacity: 0,
        rotateX: 15,
        duration: 0.8,
        ease: "power3.out",
        delay: index * 0.1,
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransform(
      `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`
    );

    // Holographic glare position
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)");
    setGlarePos({ x: 50, y: 50 });
  };

  const levelColors = {
    Foundational: "#22c55e",
    Associate: "#3b82f6",
    Professional: "#f59e0b",
    Specialty: "#ef4444",
  };

  return (
    <div
      ref={cardRef}
      className="group relative cursor-pointer"
      style={{
        transform,
        transition: "transform 0.15s ease-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Card */}
      <div
        className="relative glass-card p-6 md:p-8 overflow-hidden transition-shadow duration-500"
        style={{
          boxShadow: `0 0 30px ${cert.color}20, 0 0 60px ${cert.color}05`,
        }}
      >
        {/* Holographic glare overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
          }}
        />

        {/* Rainbow shimmer */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none z-10"
          style={{
            background: `linear-gradient(${135 + (glarePos.x - 50) * 0.5}deg, transparent 30%, ${cert.color}40 45%, rgba(168,85,247,0.2) 55%, transparent 70%)`,
          }}
        />

        {/* Level badge */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="px-3 py-1 text-[10px] tracking-[0.15em] rounded-full border font-semibold"
            style={{
              color: levelColors[cert.level],
              borderColor: `${levelColors[cert.level]}40`,
              backgroundColor: `${levelColors[cert.level]}10`,
              fontFamily: "var(--font-display)",
            }}
          >
            {cert.level.toUpperCase()}
          </span>
          <span className="text-xs text-off-white/25 font-mono">{cert.code}</span>
        </div>

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-xl mb-5 transition-transform duration-500 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${cert.color}, ${cert.color}66)`,
            boxShadow: `0 0 30px ${cert.color}30`,
          }}
        >
          ☁
        </div>

        {/* Name */}
        <h3
          className="text-lg md:text-xl font-bold text-off-white mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {cert.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-off-white/40 leading-relaxed mb-4 line-clamp-2">
          {cert.description}
        </p>

        {/* Stats row */}
        <div className="flex gap-4 text-xs text-off-white/30 mb-4">
          <span>⏱ {cert.duration}</span>
          <span>📝 {cert.questions} Qs</span>
          <span>✅ {cert.passingScore}</span>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-purple-light/10 animate-[fadeIn_0.3s_ease-out]">
            <h4
              className="text-xs tracking-[0.2em] text-purple-light/60 mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              EXAM DOMAINS
            </h4>
            <ul className="space-y-2 mb-5">
              {cert.topics.map((topic) => (
                <li key={topic} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cert.color }} />
                  <span className="text-sm text-off-white/50">{topic}</span>
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="inline-flex items-center px-5 py-2.5 text-[11px] tracking-[0.1em] font-semibold text-white rounded-full transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${cert.color}, ${cert.color}CC)`,
                boxShadow: `0 0 20px ${cert.color}40`,
                fontFamily: "var(--font-display)",
              }}
            >
              GET CERTIFIED →
            </a>
          </div>
        )}

        {/* Bottom accent */}
        <div
          className="mt-4 h-px w-0 group-hover:w-full transition-all duration-700"
          style={{ background: `linear-gradient(90deg, ${cert.color}, transparent)` }}
        />
      </div>
    </div>
  );
}

export default function CertificationsPageClient() {
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }, titleRef);

    return () => ctx.revert();
  }, []);

  return (
    <SmoothScroller>
      <PageTransition>
        <div className="gradient-hero min-h-screen">
          {/* Header */}
          <div ref={titleRef} className="pt-32 pb-16 text-center px-6">
            <span
              className="inline-block text-xs tracking-[0.3em] text-purple-light/60 mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              LEVEL UP YOUR CAREER
            </span>
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-gradient glow-text mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              CERTIFICATIONS
            </h1>
            <p className="text-off-white/40 max-w-xl mx-auto">
              Premium digital trading cards for every AWS certification we help you earn.
              Click any card to reveal exam details.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {CERTIFICATIONS.map((cert, i) => (
                <CertCard key={cert.id} cert={cert} index={i} />
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </PageTransition>
    </SmoothScroller>
  );
}
