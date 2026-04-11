"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MemberCard({ member, index }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: index * 0.12,
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
        },
      });
    });

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

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransform(
      `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`
    );
  };

  const handleMouseLeave = () => {
    setTransform("perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)");
  };

  return (
    <div
      ref={cardRef}
      className="group glass-card p-6 md:p-8 cursor-pointer transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]"
      style={{
        transform,
        transition: transform === "" ? "none" : "transform 0.15s ease-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Avatar */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white mb-6 transition-transform duration-500 group-hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${member.color}, ${member.color}88)`,
          boxShadow: `0 0 30px ${member.color}33`,
          fontFamily: "var(--font-display)",
        }}
      >
        {member.avatar}
      </div>

      {/* Info */}
      <h3
        className="text-lg md:text-xl font-bold text-off-white mb-1"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {member.name}
      </h3>
      <span className="text-sm text-purple-light font-medium tracking-wide">
        {member.role}
      </span>
      <p className="mt-3 text-sm text-off-white/40 leading-relaxed">
        {member.tagline}
      </p>

      {/* Bottom accent line */}
      <div
        className="mt-6 h-px w-0 group-hover:w-full transition-all duration-700"
        style={{
          background: `linear-gradient(90deg, ${member.color}, transparent)`,
        }}
      />
    </div>
  );
}
