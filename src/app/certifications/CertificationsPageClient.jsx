"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroller from "@/components/SmoothScroller";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

/* ── Image Modal ── */
function CertImageModal({ cert, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-dark/80 backdrop-blur-xl" />
      <div
        className="relative z-10 max-w-lg w-full glass-card p-8 text-center"
        style={{ boxShadow: `0 0 60px ${cert.color}30` }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-purple-light/20 flex items-center justify-center text-off-white/50 hover:text-off-white hover:border-purple-light/50 transition-all"
        >
          ✕
        </button>
        <span
          className="inline-block text-[10px] tracking-[0.2em] text-purple-light/60 mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {cert.level?.toUpperCase()} · {cert.code}
        </span>
        <h3
          className="text-xl font-bold text-off-white mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {cert.name}
        </h3>
        {cert.image ? (
          <div className="mb-6">
            <img
              src={cert.image}
              alt={`${cert.name} Certificate`}
              className="w-full max-h-64 object-contain rounded-xl mx-auto"
              style={{ border: `1px solid ${cert.color}30` }}
            />
          </div>
        ) : (
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6"
            style={{
              background: `linear-gradient(135deg, ${cert.color}, ${cert.color}66)`,
              boxShadow: `0 0 40px ${cert.color}30`,
            }}
          >
            ☁
          </div>
        )}
        <p className="text-sm text-off-white/40 leading-relaxed mb-6">{cert.description}</p>
        <a
          href="https://aws.amazon.com/certification/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 text-[11px] tracking-[0.1em] font-semibold text-white rounded-full transition-all duration-300 hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${cert.color}, ${cert.color}CC)`,
            boxShadow: `0 0 20px ${cert.color}40`,
            fontFamily: "var(--font-display)",
          }}
        >
          GET CERTIFIED ON AWS →
        </a>
      </div>
    </div>
  );
}

function CertCard({ cert, index }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState("");
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`);
    setGlarePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
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

  const color = cert.color || "#A855F7";
  const levelColor = levelColors[cert.level] || color;

  return (
    <>
      {showModal && <CertImageModal cert={cert} onClose={() => setShowModal(false)} />}
      <div
        ref={cardRef}
        className="group relative cursor-pointer"
        style={{ transform, transition: "transform 0.15s ease-out" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setExpanded(!expanded)}
      >
        <div
          className="relative glass-card p-6 md:p-8 overflow-hidden transition-shadow duration-500"
          style={{ boxShadow: `0 0 30px ${color}20, 0 0 60px ${color}05` }}
        >
          {/* Holographic glare overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
            style={{ background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)` }}
          />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none z-10"
            style={{ background: `linear-gradient(${135 + (glarePos.x - 50) * 0.5}deg, transparent 30%, ${color}40 45%, rgba(168,85,247,0.2) 55%, transparent 70%)` }}
          />

          {/* Level badge */}
          <div className="flex items-center justify-between mb-4">
            <span
              className="px-3 py-1 text-[10px] tracking-[0.15em] rounded-full border font-semibold"
              style={{ color: levelColor, borderColor: `${levelColor}40`, backgroundColor: `${levelColor}10`, fontFamily: "var(--font-display)" }}
            >
              {(cert.level || "").toUpperCase()}
            </span>
            <span className="text-xs text-off-white/25 font-mono">{cert.code}</span>
          </div>

          {/* Icon - always cloud */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-xl mb-5 transition-transform duration-500 group-hover:scale-110"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}66)`, boxShadow: `0 0 30px ${color}30` }}
          >
            ☁
          </div>

          <h3 className="text-lg md:text-xl font-bold text-off-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
            {cert.name}
          </h3>
          <p className="text-sm text-off-white/40 leading-relaxed mb-4 line-clamp-2">{cert.description}</p>

          <div className="flex gap-4 text-xs text-off-white/30 mb-4">
            {cert.duration && <span>⏱ {cert.duration}</span>}
            {cert.questions && <span>📝 {cert.questions} Qs</span>}
            {cert.passingScore && <span>✅ {cert.passingScore}</span>}
          </div>

          {/* Expanded content */}
          {expanded && (
            <div className="mt-4 pt-4 border-t border-purple-light/10 animate-[fadeIn_0.3s_ease-out]">
              {cert.topics?.length > 0 && (
                <>
                  <h4 className="text-xs tracking-[0.2em] text-purple-light/60 mb-3" style={{ fontFamily: "var(--font-display)" }}>
                    EXAM DOMAINS
                  </h4>
                  <ul className="space-y-2 mb-5">
                    {cert.topics.map((topic, ti) => (
                      <li key={ti} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-sm text-off-white/50">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {cert.image && (
                <div className="mb-5 rounded-xl overflow-hidden" style={{ border: `1px solid ${color}20` }}>
                  <img
                    src={cert.image}
                    alt={`${cert.name} Certificate`}
                    className="w-full max-h-48 object-contain bg-dark/50"
                  />
                </div>
              )}
              <div className="flex flex-col gap-2 w-full">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
                  className="w-full inline-flex items-center justify-center px-5 py-2.5 text-[11px] tracking-[0.1em] font-semibold text-white rounded-full transition-all duration-300 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${color}CC)`,
                    boxShadow: `0 0 20px ${color}40`,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  GET CERTIFIED →
                </button>
                {cert.image && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 text-[11px] tracking-[0.1em] font-semibold rounded-full transition-all duration-300 hover:scale-105 border"
                    style={{
                      color: color,
                      borderColor: `${color}40`,
                      background: `${color}10`,
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    VIEW CERTIFICATE
                  </button>
                )}
              </div>
            </div>
          )}

          <div
            className="mt-4 h-px w-0 group-hover:w-full transition-all duration-700"
            style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
          />
        </div>
      </div>
    </>
  );
}

export default function CertificationsPageClient() {
  const titleRef = useRef(null);
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    fetch("/api/certifications")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCerts(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, { y: 60, opacity: 0, duration: 1, ease: "power3.out" });
    }, titleRef);
    return () => ctx.revert();
  }, []);

  return (
    <SmoothScroller>
      <PageTransition>
        <div className="gradient-hero min-h-screen">
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

          <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
            {certs.length === 0 && (
              <div className="text-center py-24 text-off-white/30 text-sm">
                No certifications yet. Add some in the{" "}
                <a href="/admin" className="text-purple-light/50 hover:text-purple-light transition-colors">admin panel</a>.
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {certs.map((cert, i) => (
                <CertCard key={cert.id || cert.code || i} cert={cert} index={i} />
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </PageTransition>
    </SmoothScroller>
  );
}
