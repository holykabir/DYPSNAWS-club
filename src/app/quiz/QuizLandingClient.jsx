"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SmoothScroller from "@/components/SmoothScroller";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import useRealtimeTable from "@/hooks/useRealtimeTable";

export default function QuizLandingPage() {
  const { data: quizzes } = useRealtimeTable("quizzes", "/api/quizzes");

  const liveQuizzes = quizzes.filter((q) => q.status === "live");
  const endedQuizzes = quizzes.filter((q) => q.status === "ended");

  return (
    <SmoothScroller>
      <PageTransition>
        <div className="gradient-hero min-h-screen">
          {/* Header */}
          <div className="pt-32 pb-12 text-center px-6">
            <span
              className="inline-block text-xs tracking-[0.3em] text-purple-light/60 mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              TEST YOUR KNOWLEDGE
            </span>
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-gradient glow-text mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              QUIZZES
            </h1>
            <p className="text-off-white/40 max-w-lg mx-auto">
              Join live quizzes, compete with your peers, and climb the leaderboard in real-time.
            </p>
          </div>

          {/* Live Quizzes */}
          {liveQuizzes.length > 0 && (
            <section className="max-w-5xl mx-auto px-6 md:px-12 mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse-glow" style={{ boxShadow: "0 0 12px rgba(52,211,153,0.6)" }} />
                <h2
                  className="text-lg font-bold tracking-[0.15em]"
                  style={{ fontFamily: "var(--font-display)", color: "#34D399" }}
                >
                  LIVE NOW
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {liveQuizzes.map((quiz) => (
                  <Link
                    key={quiz.id}
                    href={`/quiz/${quiz.id}`}
                    className="group relative overflow-hidden glass-card p-6 md:p-8 hover:scale-[1.02] transition-all duration-500"
                    style={{
                      borderColor: "rgba(52,211,153,0.25)",
                      boxShadow: "0 0 30px rgba(52,211,153,0.08)",
                    }}
                  >
                    {/* Live pulse ring */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400" />
                      </span>
                      <span style={{ fontSize: "10px", letterSpacing: "0.15em", fontFamily: "var(--font-display)", color: "#34D399" }}>LIVE</span>
                    </div>

                    {/* Quiz icon */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-xl mb-5 transition-transform duration-500 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${quiz.color}, ${quiz.color}88)`,
                        boxShadow: `0 0 25px ${quiz.color}33`,
                      }}
                    >
                      ⚡
                    </div>

                    <h3 className="text-xl font-bold text-off-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-off-white/40 mb-4 line-clamp-2">
                      {quiz.description || "Join this live quiz now!"}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-off-white/30">
                      <span>📝 {quiz.questionCount} questions</span>
                      <span>⏱ {quiz.timeLimitSeconds}s each</span>
                      <span>👥 {quiz.attemptCount} playing</span>
                    </div>

                    {/* CTA */}
                    <div className="mt-5 flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all duration-300" style={{ color: "#34D399" }}>
                      <span style={{ fontFamily: "var(--font-display)", letterSpacing: "0.1em", fontSize: "12px" }}>JOIN NOW</span>
                      <span>→</span>
                    </div>

                    {/* Gradient glow on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(ellipse at 30% 50%, ${quiz.color}10, transparent 70%)` }} />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Ended Quizzes — Winners */}
          {endedQuizzes.length > 0 && (
            <section className="max-w-5xl mx-auto px-6 md:px-12 pb-24">
              <h2
                className="text-lg font-bold tracking-[0.15em] text-off-white/40 mb-8"
                style={{ fontFamily: "var(--font-display)" }}
              >
                PAST QUIZZES
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {endedQuizzes.map((quiz) => (
                  <Link
                    key={quiz.id}
                    href={`/quiz/${quiz.id}`}
                    className="group glass-card p-5 hover:scale-[1.02] transition-all duration-500"
                    style={{ borderColor: "rgba(168,85,247,0.1)" }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-sm"
                        style={{ background: `${quiz.color}20`, color: quiz.color }}
                      >
                        🏆
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-off-white" style={{ fontFamily: "var(--font-display)" }}>
                          {quiz.title}
                        </h3>
                        <span className="text-[10px] text-off-white/30">ENDED • {quiz.attemptCount} participants</span>
                      </div>
                    </div>
                    <div className="text-xs text-purple-light/50 group-hover:text-purple-light transition-colors">
                      View results →
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {quizzes.length === 0 && (
            <div className="text-center py-20">
              <p className="text-off-white/30 text-sm">No quizzes available yet. Check back soon!</p>
            </div>
          )}

          {liveQuizzes.length === 0 && endedQuizzes.length === 0 && quizzes.length > 0 && (
            <div className="text-center py-20">
              <p className="text-off-white/30 text-sm">No live or completed quizzes right now. Check back soon!</p>
            </div>
          )}
        </div>
        <Footer />
      </PageTransition>
    </SmoothScroller>
  );
}
