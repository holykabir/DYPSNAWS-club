"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";

const STATUS_COLORS = {
  draft: { bg: "rgba(245,245,245,0.06)", border: "rgba(245,245,245,0.15)", text: "rgba(245,245,245,0.5)" },
  live: { bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.3)", text: "#34D399" },
  ended: { bg: "rgba(245,100,100,0.08)", border: "rgba(245,100,100,0.2)", text: "rgba(245,100,100,0.7)" },
};

export default function QuizzesListPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const router = useRouter();

  const fetchQuizzes = () => {
    fetch("/api/quizzes")
      .then((r) => r.json())
      .then((data) => setQuizzes(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchQuizzes(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(id);
    const res = await fetch(`/api/quizzes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) fetchQuizzes();
    setActionLoading(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this quiz and all its data?")) return;
    setActionLoading(id);
    const res = await fetch(`/api/quizzes/${id}`, { method: "DELETE" });
    if (res.ok) setQuizzes((prev) => prev.filter((q) => q.id !== id));
    setActionLoading(null);
  };

  return (
    <AdminLayout title="QUIZZES" subtitle="Create and manage live quizzes">
      {/* Actions bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <span style={{ fontSize: "13px", color: "rgba(245,245,245,0.35)" }}>
          {quizzes.length} quizzes
        </span>
        <Link
          href="/admin/dashboard/quizzes/new"
          style={{
            padding: "10px 20px", borderRadius: "10px", background: "linear-gradient(135deg, #6B21A8, #A855F7)",
            color: "#fff", fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.1em",
            textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          CREATE QUIZ
        </Link>
      </div>

      {/* Quiz Cards */}
      <div style={{ display: "grid", gap: "16px" }}>
        {loading && <div style={{ padding: "40px", textAlign: "center", color: "rgba(245,245,245,0.3)", fontSize: "13px" }}>Loading...</div>}
        {!loading && quizzes.length === 0 && <div style={{ padding: "40px", textAlign: "center", color: "rgba(245,245,245,0.3)", fontSize: "13px" }}>No quizzes yet. Create your first one!</div>}

        {quizzes.map((quiz) => {
          const sc = STATUS_COLORS[quiz.status] || STATUS_COLORS.draft;
          return (
            <div
              key={quiz.id}
              style={{
                background: "rgba(107,33,168,0.06)", border: "1px solid rgba(168,85,247,0.12)",
                borderRadius: "16px", padding: "24px", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(168,85,247,0.25)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(168,85,247,0.12)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#F5F5F5" }}>{quiz.title}</h3>
                    {/* Status Badge */}
                    <span style={{
                      padding: "3px 10px", borderRadius: "999px", fontSize: "10px",
                      fontFamily: "var(--font-display)", letterSpacing: "0.12em",
                      color: sc.text, border: `1px solid ${sc.border}`, background: sc.bg,
                      textTransform: "uppercase",
                      ...(quiz.status === "live" ? { animation: "pulse-glow 2s ease-in-out infinite" } : {}),
                    }}>
                      {quiz.status === "live" && "● "}
                      {quiz.status}
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "rgba(245,245,245,0.4)", marginBottom: "12px" }}>
                    {quiz.description || "No description"}
                  </p>
                  <div style={{ display: "flex", gap: "20px", fontSize: "12px", color: "rgba(245,245,245,0.3)" }}>
                    <span>📝 {quiz.questionCount} questions</span>
                    <span>👥 {quiz.attemptCount} completed</span>
                    <span>⏱ {quiz.timeLimitSeconds}s per question</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  {quiz.status === "draft" && (
                    <button
                      onClick={() => handleStatusChange(quiz.id, "live")}
                      disabled={actionLoading === quiz.id || quiz.questionCount === 0}
                      style={{
                        padding: "6px 14px", borderRadius: "8px",
                        background: quiz.questionCount === 0 ? "rgba(52,211,153,0.05)" : "rgba(52,211,153,0.15)",
                        border: "1px solid rgba(52,211,153,0.3)", color: "#34D399", fontSize: "11px",
                        cursor: quiz.questionCount === 0 ? "not-allowed" : "pointer",
                        opacity: quiz.questionCount === 0 ? 0.4 : 1,
                        transition: "all 0.2s",
                      }}
                      title={quiz.questionCount === 0 ? "Add questions first" : "Start the quiz"}
                    >
                      GO LIVE
                    </button>
                  )}
                  {quiz.status === "live" && (
                    <button
                      onClick={() => handleStatusChange(quiz.id, "ended")}
                      disabled={actionLoading === quiz.id}
                      style={{
                        padding: "6px 14px", borderRadius: "8px",
                        background: "rgba(245,100,100,0.1)", border: "1px solid rgba(245,100,100,0.2)",
                        color: "rgba(245,100,100,0.7)", fontSize: "11px", cursor: "pointer", transition: "all 0.2s",
                      }}
                    >
                      END QUIZ
                    </button>
                  )}
                  <button
                    onClick={() => router.push(`/admin/dashboard/quizzes/${quiz.id}`)}
                    style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(168,85,247,0.2)", background: "transparent", color: "#A855F7", fontSize: "11px", cursor: "pointer", transition: "all 0.2s" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    disabled={actionLoading === quiz.id}
                    style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(245,100,100,0.2)", background: "transparent", color: "rgba(245,100,100,0.7)", fontSize: "11px", cursor: "pointer", transition: "all 0.2s", opacity: actionLoading === quiz.id ? 0.5 : 1 }}
                  >
                    {actionLoading === quiz.id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
