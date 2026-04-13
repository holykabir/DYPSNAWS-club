"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MemberCard from "./MemberCard";
import useRealtimeTable from "@/hooks/useRealtimeTable";

gsap.registerPlugin(ScrollTrigger);

const transformMember = (row) => ({
  id: row.id,
  name: row.name,
  role: row.role,
  tagline: row.tagline,
  avatar: row.avatar,
  color: row.color,
  bio: row.bio || "",
  certifications: row.certifications || [],
  social: row.social || {},
});

export default function TeamSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const { data: teamMembers } = useRealtimeTable("team_members", "/api/team", {
    transform: transformMember,
    filter: { column: "member_type", value: "core" },
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 80,
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

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-40 gradient-section overflow-hidden"
      id="team"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-deep/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div ref={titleRef} className="mb-20 text-center">
          <span
            className="inline-block text-xs tracking-[0.3em] text-purple-light/60 mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            THE PEOPLE
          </span>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient"
            style={{ fontFamily: "var(--font-display)" }}
          >
            CORE TEAM
          </h2>
          <p className="mt-4 text-off-white/40 max-w-lg mx-auto">
            The visionaries behind the cloud. Meet the team that makes it all
            happen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {teamMembers.map((member, index) => (
            <MemberCard key={member.id || member.name} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
