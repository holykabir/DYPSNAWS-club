"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import useRealtimeTable from "@/hooks/useRealtimeTable";

const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(168,85,247,0.15)", color: "#F5F5F5", fontSize: "13px", outline: "none" };
const labelStyle = { display: "block", fontSize: "10px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: "rgba(168,85,247,0.5)", marginBottom: "8px" };
const COLORS = ["#A855F7", "#C084FC", "#7C3AED", "#9333EA", "#8B5CF6", "#34D399", "#60A5FA", "#F59E0B"];

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [quizStatus, setQuizStatus] = useState("draft");

  // Live leaderboard via realtime
  const { data: liveAttempts } = useRealtimeTable("quiz_attempts", `/api/quizzes/${params.id}/leaderboard`, {
    primaryKey: "rank",
  });

  useEffect(() => {
    fetch(`/api/quizzes/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setForm({
            title: data.title || "",
            description: data.description || "",
            timeLimitSeconds: data.timeLimitSeconds || 30,
            color: data.color || "#A855F7",
          });
          setQuizStatus(data.status);
          setQuestions(
            data.questions?.length
              ? data.questions.map((q) => ({
                  question: q.question,
                  options: q.options,
                  correctIndex: q.correctIndex,
                  points: q.points || 10,
                }))
              : [{ question: "", options: ["", "", "", ""], correctIndex: 0, points: 10 }]
          );
        }
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const updateQuestion = (qi, field, value) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[qi] = { ...next[qi], [field]: value };
      return next;
    });
  };

  const updateOption = (qi, oi, value) => {
    setQuestions((prev) => {
      const next = [...prev];
      const opts = [...next[qi].options];
      opts[oi] = value;
      next[qi] = { ...next[qi], options: opts };
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const validQuestions = questions.filter((q) => q.question.trim() && q.options.some((o) => o.trim()));

    try {
      const res = await fetch(`/api/quizzes/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, questions: validQuestions }),
      });
      if (res.ok) router.push("/admin/dashboard/quizzes");
      else { const d = await res.json(); setError(d.error || "Failed"); }
    } catch { setError("Network error"); }
    finally { setSaving(false); }
  };

  const handleStatusChange = async (newStatus) => {
    const res = await fetch(`/api/quizzes/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) setQuizStatus(newStatus);
  };

  if (loading) {
    return (
      <AdminLayout title="EDIT QUIZ" subtitle="Loading...">
        <div style={{ textAlign: "center", padding: "60px", color: "rgba(245,245,245,0.3)" }}>Loading...</div>
      </AdminLayout>
    );
  }

  if (!form) {
    return (
      <AdminLayout title="QUIZ NOT FOUND">
        <div style={{ textAlign: "center", padding: "60px", color: "rgba(245,245,245,0.3)" }}>{error || "Quiz not found"}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="EDIT QUIZ" subtitle={`Editing: ${form.title}`}>
      <div style={{ display: "grid", gridTemplateColumns: quizStatus === "live" ? "1fr 340px" : "1fr", gap: "24px" }}>
        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          {error && <div style={{ padding: "10px 16px", borderRadius: "10px", background: "rgba(245,100,100,0.1)", border: "1px solid rgba(245,100,100,0.2)", color: "#F56565", fontSize: "13px", marginBottom: "20px" }}>{error}</div>}

          {/* Status bar */}
          <div style={{
            background: "rgba(107,33,168,0.06)", border: "1px solid rgba(168,85,247,0.12)",
            borderRadius: "16px", padding: "16px 24px", marginBottom: "20px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "11px", fontFamily: "var(--font-display)", letterSpacing: "0.12em", color: "rgba(245,245,245,0.4)" }}>STATUS:</span>
              <span style={{
                padding: "3px 10px", borderRadius: "999px", fontSize: "10px",
                fontFamily: "var(--font-display)", letterSpacing: "0.12em", textTransform: "uppercase",
                color: quizStatus === "live" ? "#34D399" : quizStatus === "ended" ? "rgba(245,100,100,0.7)" : "rgba(245,245,245,0.5)",
                border: `1px solid ${quizStatus === "live" ? "rgba(52,211,153,0.3)" : quizStatus === "ended" ? "rgba(245,100,100,0.2)" : "rgba(245,245,245,0.15)"}`,
                background: quizStatus === "live" ? "rgba(52,211,153,0.1)" : quizStatus === "ended" ? "rgba(245,100,100,0.08)" : "rgba(245,245,245,0.06)",
              }}>
                {quizStatus === "live" && "● "}{quizStatus}
              </span>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {quizStatus === "draft" && (
                <button type="button" onClick={() => handleStatusChange("live")} style={{
                  padding: "6px 14px", borderRadius: "8px", background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)",
                  color: "#34D399", fontSize: "11px", cursor: "pointer",
                }}>GO LIVE</button>
              )}
              {quizStatus === "live" && (
                <button type="button" onClick={() => handleStatusChange("ended")} style={{
                  padding: "6px 14px", borderRadius: "8px", background: "rgba(245,100,100,0.1)", border: "1px solid rgba(245,100,100,0.2)",
                  color: "rgba(245,100,100,0.7)", fontSize: "11px", cursor: "pointer",
                }}>END QUIZ</button>
              )}
            </div>
          </div>

          {/* Quiz Details */}
          <div style={{ background: "rgba(107,33,168,0.06)", border: "1px solid rgba(168,85,247,0.12)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: "rgba(245,245,245,0.4)", marginBottom: "20px" }}>QUIZ DETAILS</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>TITLE</label>
                <input style={inputStyle} value={form.title} onChange={(e) => update("title", e.target.value)} required />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>DESCRIPTION</label>
                <textarea style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} value={form.description} onChange={(e) => update("description", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>TIME PER QUESTION (SECONDS)</label>
                <input style={inputStyle} type="number" value={form.timeLimitSeconds} onChange={(e) => update("timeLimitSeconds", Number(e.target.value))} min="5" max="300" />
              </div>
              <div>
                <label style={labelStyle}>ACCENT COLOR</label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {COLORS.map((c) => (
                    <button key={c} type="button" onClick={() => update("color", c)} style={{
                      width: "28px", height: "28px", borderRadius: "8px", background: c,
                      border: form.color === c ? "2px solid #fff" : "2px solid transparent", cursor: "pointer",
                    }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div style={{ background: "rgba(107,33,168,0.06)", border: "1px solid rgba(168,85,247,0.12)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: "rgba(245,245,245,0.4)", marginBottom: "20px" }}>QUESTIONS ({questions.length})</h3>

            {questions.map((q, qi) => (
              <div key={qi} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(168,85,247,0.1)", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "11px", fontFamily: "var(--font-display)", letterSpacing: "0.12em", color: "rgba(168,85,247,0.5)" }}>Q{qi + 1}</span>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <label style={{ ...labelStyle, marginBottom: 0, fontSize: "9px" }}>PTS</label>
                    <input style={{ ...inputStyle, width: "50px", padding: "4px 8px", textAlign: "center" }} type="number" value={q.points} onChange={(e) => updateQuestion(qi, "points", Number(e.target.value))} min="1" />
                    {questions.length > 1 && <button type="button" onClick={() => setQuestions((prev) => prev.filter((_, i) => i !== qi))} style={{ color: "rgba(245,100,100,0.6)", background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}>×</button>}
                  </div>
                </div>
                <input style={{ ...inputStyle, marginBottom: "14px" }} value={q.question} onChange={(e) => updateQuestion(qi, "question", e.target.value)} placeholder="Enter your question..." />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {q.options.map((opt, oi) => (
                    <div key={oi} style={{ position: "relative" }}>
                      <input style={{ ...inputStyle, paddingLeft: "36px", borderColor: q.correctIndex === oi ? "rgba(52,211,153,0.4)" : undefined, background: q.correctIndex === oi ? "rgba(52,211,153,0.06)" : undefined }} value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + oi)}`} />
                      <button type="button" onClick={() => updateQuestion(qi, "correctIndex", oi)} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", borderRadius: "50%", cursor: "pointer", background: q.correctIndex === oi ? "#34D399" : "transparent", border: q.correctIndex === oi ? "2px solid #34D399" : "2px solid rgba(245,245,245,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#fff" }} title="Mark correct">
                        {q.correctIndex === oi && "✓"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setQuestions((prev) => [...prev, { question: "", options: ["", "", "", ""], correctIndex: 0, points: 10 }])} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px dashed rgba(168,85,247,0.3)", background: "transparent", color: "#A855F7", fontSize: "12px", cursor: "pointer", fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}>+ ADD QUESTION</button>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button type="button" onClick={() => router.back()} style={{ padding: "10px 24px", borderRadius: "10px", border: "1px solid rgba(168,85,247,0.2)", background: "transparent", color: "rgba(245,245,245,0.5)", fontSize: "12px", cursor: "pointer", fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}>CANCEL</button>
            <button type="submit" disabled={saving} style={{ padding: "10px 24px", borderRadius: "10px", background: "linear-gradient(135deg, #6B21A8, #A855F7)", color: "#fff", fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.1em", border: "none", cursor: "pointer", fontWeight: 600, opacity: saving ? 0.6 : 1 }}>{saving ? "SAVING..." : "UPDATE QUIZ"}</button>
          </div>
        </form>

        {/* Live Leaderboard Panel */}
        {quizStatus === "live" && (
          <div style={{
            background: "rgba(107,33,168,0.06)", border: "1px solid rgba(52,211,153,0.15)",
            borderRadius: "16px", padding: "24px", height: "fit-content", position: "sticky", top: "24px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34D399", animation: "pulse-glow 2s ease-in-out infinite" }} />
              <h3 style={{ fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: "#34D399" }}>LIVE LEADERBOARD</h3>
            </div>

            {liveAttempts.length === 0 ? (
              <p style={{ fontSize: "12px", color: "rgba(245,245,245,0.3)", textAlign: "center", padding: "20px 0" }}>Waiting for participants...</p>
            ) : (
              <div style={{ display: "grid", gap: "8px" }}>
                {liveAttempts.map((entry, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 12px", borderRadius: "10px",
                    background: i === 0 ? "rgba(245,158,11,0.08)" : i === 1 ? "rgba(192,192,192,0.05)" : i === 2 ? "rgba(205,127,50,0.05)" : "transparent",
                    border: `1px solid ${i === 0 ? "rgba(245,158,11,0.2)" : i < 3 ? "rgba(168,85,247,0.1)" : "transparent"}`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: i === 0 ? "#F59E0B" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "rgba(245,245,245,0.3)", width: "20px" }}>
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                      </span>
                      <div>
                        <div style={{ fontSize: "13px", color: "#F5F5F5", fontWeight: 500 }}>{entry.userName}</div>
                        <div style={{ fontSize: "10px", color: "rgba(245,245,245,0.3)" }}>
                          {entry.completed ? "✓ Completed" : "Playing..."}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-display)",
                      color: i === 0 ? "#F59E0B" : "#A855F7",
                    }}>
                      {entry.score}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
