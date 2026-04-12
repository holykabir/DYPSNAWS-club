"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function TeamRoster() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const containerRef = useRef(null);
  const cardsRef = useRef({});
  const overlayRef = useRef(null);
  const detailRef = useRef(null);

  const selected = teamMembers.find((m) => m.id === selectedId);

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setTeamMembers(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (teamMembers.length === 0) return;
    const cards = Object.values(cardsRef.current).filter(Boolean);
    cards.forEach((card, i) => {
      gsap.to(card, {
        y: "random(-15, 15)",
        x: "random(-8, 8)",
        rotation: "random(-3, 3)",
        duration: "random(3, 5)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.3,
      });
    });
  }, [teamMembers]);

  const handleSelect = (member) => {
    setSelectedId(member.id);

    // Animate overlay in
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" }
    );

    // Animate detail card in
    gsap.fromTo(
      detailRef.current,
      { opacity: 0, scale: 0.85, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)", delay: 0.1 }
    );
  };

  const handleClose = () => {
    gsap.to(detailRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 30,
      duration: 0.3,
      ease: "power2.in",
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => setSelectedId(null),
    });
  };

  // Orbit positions — circular layout
  const getOrbitStyle = (index, total) => {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    const radiusX = typeof window !== "undefined" && window.innerWidth < 768 ? 30 : 35;
    const radiusY = typeof window !== "undefined" && window.innerWidth < 768 ? 30 : 28;
    const x = 50 + radiusX * Math.cos(angle);
    const y = 50 + radiusY * Math.sin(angle);
    return {
      left: `${x}%`,
      top: `${y}%`,
      transform: "translate(-50%, -50%)",
    };
  };

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Floating cards in orbit */}
      <div className="relative w-full h-[80vh] md:h-[85vh]">
        {teamMembers.map((member, index) => (
          <div
            key={member.id}
            ref={(el) => (cardsRef.current[member.id] = el)}
            className="absolute cursor-pointer group"
            style={getOrbitStyle(index, teamMembers.length)}
            onClick={() => handleSelect(member)}
          >
            <div className="glass-card p-5 md:p-6 w-[180px] md:w-[220px] transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] group-hover:scale-105 group-hover:border-purple-light/40">
              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-base font-bold text-white mb-4 transition-transform duration-500 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${member.color}, ${member.color}88)`,
                  boxShadow: `0 0 25px ${member.color}33`,
                  fontFamily: "var(--font-display)",
                }}
              >
                {member.avatar}
              </div>

              {/* Name */}
              <h3
                className="text-sm font-bold text-off-white mb-0.5 truncate"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {member.name}
              </h3>
              <p className="text-xs text-purple-light/70">{member.role}</p>

              {/* Expand hint */}
              <div className="mt-3 h-px w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-purple-light/50 to-transparent" />
            </div>
          </div>
        ))}

        {/* Center label */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <span
            className="text-xs tracking-[0.3em] text-purple-light/25 block mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            CLICK TO
          </span>
          <span
            className="text-sm tracking-[0.2em] text-purple-light/40"
            style={{ fontFamily: "var(--font-display)" }}
          >
            EXPLORE
          </span>
        </div>
      </div>

      {/* Expanded Detail Overlay */}
      {selectedId && selected && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-dark/70 backdrop-blur-xl"
            onClick={handleClose}
          />

          {/* Detail Card */}
          <div
            ref={detailRef}
            className="relative z-10 w-full max-w-lg glass-card p-8 md:p-10 overflow-y-auto max-h-[85vh]"
            style={{ boxShadow: `0 0 60px ${selected.color}25` }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-purple-light/20 flex items-center justify-center text-off-white/50 hover:text-off-white hover:border-purple-light/50 transition-all"
            >
              ✕
            </button>

            {/* Avatar large */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6"
              style={{
                background: `linear-gradient(135deg, ${selected.color}, ${selected.color}88)`,
                boxShadow: `0 0 40px ${selected.color}40`,
                fontFamily: "var(--font-display)",
              }}
            >
              {selected.avatar}
            </div>

            {/* Name & Role */}
            <h2
              className="text-2xl md:text-3xl font-bold text-off-white mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {selected.name}
            </h2>
            <p className="text-sm text-purple-light font-medium mb-2">
              {selected.role}
            </p>
            <p className="text-xs text-off-white/40 italic mb-6">
              &ldquo;{selected.tagline}&rdquo;
            </p>

            {/* Divider */}
            <div
              className="h-px w-full mb-6"
              style={{
                background: `linear-gradient(90deg, ${selected.color}40, transparent)`,
              }}
            />

            {/* Bio */}
            <h4
              className="text-xs tracking-[0.2em] text-purple-light/60 mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ABOUT
            </h4>
            <p className="text-sm text-off-white/50 leading-relaxed mb-6">
              {selected.bio}
            </p>

            {/* Certifications */}
            <h4
              className="text-xs tracking-[0.2em] text-purple-light/60 mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              AWS CERTIFICATIONS
            </h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {selected.certifications.map((cert) => (
                <span
                  key={cert}
                  className="px-3 py-1.5 text-xs rounded-full border text-off-white/60"
                  style={{
                    borderColor: `${selected.color}30`,
                    backgroundColor: `${selected.color}10`,
                  }}
                >
                  ☁ {cert}
                </span>
              ))}
            </div>

            {/* Social Links */}
            <h4
              className="text-xs tracking-[0.2em] text-purple-light/60 mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              CONNECT
            </h4>
            <div className="flex gap-3">
              {Object.entries(selected.social).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs text-off-white/40 hover:text-purple-light border border-purple-light/15 hover:border-purple-light/40 rounded-full transition-all duration-300 capitalize"
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
