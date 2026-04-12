"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);



function CertBadge({ cert, index }) {
  return (
    <Link
      href="/certifications"
      className="flex-shrink-0 glass-card px-6 py-5 md:px-8 md:py-6 flex flex-col items-center text-center min-w-[200px] md:min-w-[240px] animate-[bobbing_3s_ease-in-out_infinite] hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.35)] transition-all duration-300 cursor-pointer"
      style={{
        animationDelay: `${index * 0.3}s`,
        boxShadow: "0 0 25px rgba(168, 85, 247, 0.2), 0 0 50px rgba(168, 85, 247, 0.05)",
      }}
    >
      {/* Icon - always cloud */}
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold mb-3" 
        style={{ 
          background: `linear-gradient(135deg, ${cert.color || "#A855F7"}, ${cert.color || "#A855F7"}88)`,
          fontFamily: "var(--font-display)" 
        }}
      >
        ☁
      </div>

      {/* Level badge */}
      <span
        className="text-[10px] tracking-[0.2em] text-purple-light/70 mb-2 uppercase"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {cert.level}
      </span>

      {/* Name */}
      <h4 className="text-sm md:text-base font-semibold text-off-white mb-1">
        {cert.name}
      </h4>

      {/* Code */}
      <span className="text-xs text-purple-light/50 font-mono">{cert.code}</span>
    </Link>
  );
}

export default function CertificationsSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    fetch("/api/certifications")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setCerts(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const doubledCerts = certs.length > 0 ? [...certs, ...certs, ...certs, ...certs].slice(0, Math.max(10, certs.length * 2)) : [];

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-40 gradient-certs overflow-hidden"
      id="certifications"
    >
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-deep/10 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <div ref={titleRef} className="text-center">
          <span
            className="inline-block text-xs tracking-[0.3em] text-purple-light/60 mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            LEVEL UP
          </span>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            CERTIFICATIONS
          </h2>
          <p className="text-off-white/40 max-w-lg mx-auto mb-4">
            We help students earn industry-recognized AWS certifications. From
            foundational to specialty.
          </p>
          <Link
            href="/certifications"
            className="inline-block text-xs tracking-[0.2em] text-purple-light/50 hover:text-purple-light transition-colors"
            style={{ fontFamily: "var(--font-display)" }}
          >
            VIEW ALL CERTIFICATIONS →
          </Link>
        </div>
      </div>

      {doubledCerts.length > 0 && (
        <>
          {/* Marquee Row 1 */}
          <div className="relative mb-6" style={{ overflow: "clip", overflowClipMargin: "20px" }}>
            <div className="flex gap-6 animate-[marquee_30s_linear_infinite] w-max py-4">
              {doubledCerts.map((cert, i) => (
                <CertBadge key={`row1-${i}`} cert={cert} index={i % certs.length} />
              ))}
            </div>
          </div>

          {/* Marquee Row 2 */}
          <div className="relative" style={{ overflow: "clip", overflowClipMargin: "20px" }}>
            <div className="flex gap-6 animate-[marquee-reverse_35s_linear_infinite] w-max py-4">
              {doubledCerts.map((cert, i) => (
                <CertBadge key={`row2-${i}`} cert={cert} index={(i + 4) % certs.length} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-dark to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-dark to-transparent z-10 pointer-events-none" />
    </section>
  );
}
