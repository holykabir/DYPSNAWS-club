"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";

function MagneticIcon({ children, href }) {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full border border-purple-light/20 flex items-center justify-center text-off-white/40 hover:text-purple-light hover:border-purple-light/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all duration-300"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="relative py-16 md:py-20 border-t border-purple-deep/20">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-light/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3
              className="text-xl font-bold text-gradient mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              AWS CLOUD CLUBS
            </h3>
            <p className="text-sm text-off-white/40 leading-relaxed max-w-xs">
              Building the next generation of cloud architects. Learn, build, and get certified.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="text-xs tracking-[0.2em] text-purple-light/60 mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              NAVIGATE
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Events", href: "/events" },
                { label: "Team", href: "/team" },
                { label: "Certifications", href: "/certifications" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-off-white/40 hover:text-purple-light transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social with magnetic hover */}
          <div>
            <h4
              className="text-xs tracking-[0.2em] text-purple-light/60 mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              CONNECT
            </h4>
            <div className="flex gap-3">
              <MagneticIcon href="#">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
              </MagneticIcon>
              <MagneticIcon href="#">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" /></svg>
              </MagneticIcon>
              <MagneticIcon href="#">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </MagneticIcon>
              <MagneticIcon href="#">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </MagneticIcon>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4
              className="text-xs tracking-[0.2em] text-purple-light/60 mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              RESOURCES
            </h4>
            <ul className="space-y-2">
              {[
                { label: "AWS Free Tier", href: "https://aws.amazon.com/free" },
                { label: "Documentation", href: "#" },
                { label: "Community", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-off-white/40 hover:text-purple-light transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-purple-deep/15 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-off-white/25">
            © 2026 AWS Cloud Clubs. Built with ☁ and ambition.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-xs text-off-white/20">
              Designed & Developed by{" "}
              <a
                href="https://github.com/holykabir"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-light/60 hover:text-purple-light transition-colors duration-300 underline underline-offset-2"
              >
                Kabir Walvekar
              </a>.
            </p>
            <Link
              href="/admin"
              className="text-[10px] text-off-white/15 hover:text-purple-light/40 transition-colors duration-300 tracking-[0.1em]"
            >
              ADMIN
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
