"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";

export default function MagneticButton({ children, href = "#", className = "" }) {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.4)",
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <a
      ref={buttonRef}
      href={href}
      className={`group relative inline-flex items-center justify-center px-10 py-5 text-sm tracking-[0.15em] font-semibold text-white rounded-full overflow-hidden transition-shadow duration-500 ${
        isHovered
          ? "shadow-[0_0_40px_rgba(168,85,247,0.4)]"
          : "shadow-[0_0_20px_rgba(168,85,247,0.15)]"
      } ${className}`}
      style={{ fontFamily: "var(--font-display)" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-deep to-purple-light" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-light to-purple-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <span className="relative z-10">{children}</span>

      {/* Shine effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </a>
  );
}
