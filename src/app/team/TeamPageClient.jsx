"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroller from "@/components/SmoothScroller";
import PageTransition from "@/components/PageTransition";
import dynamic from "next/dynamic";
import Footer from "@/components/Footer";
import useRealtimeTable from "@/hooks/useRealtimeTable";

const TeamRoster = dynamic(() => import("@/components/TeamRoster"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

function ContributorCard({ member, index }) {
  const cardRef = useRef(null);

  // Random entry angle for "meteor shower" effect
  const angles = [
    { x: -80, y: 40, rotate: -8 },
    { x: 60, y: 50, rotate: 6 },
    { x: -40, y: 60, rotate: -4 },
    { x: 70, y: 45, rotate: 10 },
    { x: -60, y: 55, rotate: -12 },
    { x: 50, y: 35, rotate: 7 },
  ];
  const angle = angles[index % angles.length];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        x: angle.x,
        y: angle.y,
        rotation: angle.rotate,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: index * 0.08,
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 92%",
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, [angle.x, angle.y, angle.rotate, index]);

  return (
    <div
      ref={cardRef}
      className="glass-card p-5 group hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:scale-[1.03] transition-all duration-500"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 transition-transform duration-500 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${member.color}, ${member.color}88)`,
            boxShadow: `0 0 20px ${member.color}25`,
            fontFamily: "var(--font-display)",
          }}
        >
          {member.avatar}
        </div>

        {/* Info */}
        <div className="min-w-0">
          <h4
            className="text-sm font-semibold text-off-white truncate"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {member.name}
          </h4>
          <p className="text-xs text-purple-light/60">{member.role}</p>
        </div>
      </div>

      {/* Tagline */}
      <p className="mt-3 text-xs text-off-white/30 leading-relaxed italic">
        &ldquo;{member.tagline}&rdquo;
      </p>

      {/* Bottom line */}
      <div
        className="mt-3 h-px w-0 group-hover:w-full transition-all duration-700"
        style={{ background: `linear-gradient(90deg, ${member.color}60, transparent)` }}
      />
    </div>
  );
}

export default function TeamPageClient() {
  const contributorsTitleRef = useRef(null);
  const { data: contributors } = useRealtimeTable("team_members", "/api/team?type=contributor", {
    transform: (row) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      tagline: row.tagline,
      avatar: row.avatar,
      color: row.color,
    }),
    filter: { column: "member_type", value: "contributor" },
  });

  useEffect(() => {
    if (!contributorsTitleRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(contributorsTitleRef.current, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: contributorsTitleRef.current,
          start: "top 85%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <SmoothScroller>
      <PageTransition>
        <div className="gradient-hero min-h-screen">
          {/* Header */}
          <div className="pt-32 pb-8 text-center px-6">
            <span
              className="inline-block text-xs tracking-[0.3em] text-purple-light/60 mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ZERO-GRAVITY ROSTER
            </span>
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-gradient glow-text mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              THE TEAM
            </h1>
            <p className="text-off-white/40 max-w-lg mx-auto">
              Our crew, floating in the cloud. Click anyone to learn more.
            </p>
          </div>

          {/* Core Team — Floating orbit */}
          <TeamRoster />
        </div>

        {/* Contributors — Meteor Shower Section */}
        <section className="relative gradient-section py-24 md:py-32 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-light/20 to-transparent" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-deep/10 rounded-full blur-[180px] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div ref={contributorsTitleRef} className="text-center mb-16">
              <span
                className="inline-block text-xs tracking-[0.3em] text-purple-light/60 mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                THE EXTENDED CREW
              </span>
              <h2
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-gradient mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                CONTRIBUTORS
              </h2>
              <p className="text-off-white/40 max-w-lg mx-auto">
                The people who make every workshop, hackathon, and meetup possible.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {contributors.map((member, index) => (
                <ContributorCard key={member.name || index} member={member} index={index} />
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </PageTransition>
    </SmoothScroller>
  );
}
