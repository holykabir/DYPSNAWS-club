"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";

const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(168,85,247,0.15)", color: "#F5F5F5", fontSize: "13px", outline: "none" };
const labelStyle = { display: "block", fontSize: "10px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: "rgba(168,85,247,0.5)", marginBottom: "8px" };
const COLORS = ["#A855F7", "#C084FC", "#7C3AED", "#9333EA", "#8B5CF6", "#34D399", "#60A5FA", "#F59E0B"];

const emptyQuestion = () => ({ question: "", options: ["", "", "", ""], correctIndex: 0, points: 10 });

export default function NewQuizPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    timeLimitSeconds: 30,
    color: "#A855F7",
  });
  const [questions, setQuestions] = useState([emptyQuestion()]);

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
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, questions: validQuestions }),
      });
      if (res.ok) router.push("/admin/dashboard/quizzes");
      else { const d = await res.json(); setError(d.error || "Failed"); }
    } catch { setError("Network error"); }
    finally { setSaving(false); }
  };

  return (
    <AdminLayout title="CREATE QUIZ" subtitle="Build a new quiz with questions">
      <form onSubmit={handleSubmit} style={{ maxWidth: "800px" }}>
        {error && <div style={{ padding: "10px 16px", borderRadius: "10px", background: "rgba(245,100,100,0.1)", border: "1px solid rgba(245,100,100,0.2)", color: "#F56565", fontSize: "13px", marginBottom: "20px" }}>{error}</div>}

        {/* Quiz Details */}
        <div style={{ background: "rgba(107,33,168,0.06)", border: "1px solid rgba(168,85,247,0.12)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: "rgba(245,245,245,0.4)", marginBottom: "20px" }}>QUIZ DETAILS</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>TITLE</label>
              <input style={inputStyle} value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. AWS Cloud Practitioner Challenge" required />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>DESCRIPTION</label>
              <textarea style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="What is this quiz about?" />
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: "rgba(245,245,245,0.4)" }}>QUESTIONS ({questions.length})</h3>
          </div>

          {questions.map((q, qi) => (
            <div key={qi} style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(168,85,247,0.1)",
              borderRadius: "12px", padding: "20px", marginBottom: "16px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "11px", fontFamily: "var(--font-display)", letterSpacing: "0.12em", color: "rgba(168,85,247,0.5)" }}>
                  QUESTION {qi + 1}
                </span>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <label style={{ ...labelStyle, marginBottom: 0, fontSize: "9px" }}>POINTS</label>
                  <input style={{ ...inputStyle, width: "60px", padding: "4px 8px", textAlign: "center" }} type="number" value={q.points} onChange={(e) => updateQuestion(qi, "points", Number(e.target.value))} min="1" />
                  {questions.length > 1 && (
                    <button type="button" onClick={() => setQuestions((prev) => prev.filter((_, i) => i !== qi))} style={{ color: "rgba(245,100,100,0.6)", background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}>×</button>
                  )}
                </div>
              </div>

              <input style={{ ...inputStyle, marginBottom: "14px" }} value={q.question} onChange={(e) => updateQuestion(qi, "question", e.target.value)} placeholder="Enter your question..." />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {q.options.map((opt, oi) => (
                  <div key={oi} style={{ position: "relative" }}>
                    <input
                      style={{
                        ...inputStyle,
                        paddingLeft: "36px",
                        borderColor: q.correctIndex === oi ? "rgba(52,211,153,0.4)" : "rgba(168,85,247,0.15)",
                        background: q.correctIndex === oi ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.03)",
                      }}
                      value={opt}
                      onChange={(e) => updateOption(qi, oi, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                    />
                    <button
                      type="button"
                      onClick={() => updateQuestion(qi, "correctIndex", oi)}
                      style={{
                        position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)",
                        width: "18px", height: "18px", borderRadius: "50%", cursor: "pointer",
                        background: q.correctIndex === oi ? "#34D399" : "transparent",
                        border: q.correctIndex === oi ? "2px solid #34D399" : "2px solid rgba(245,245,245,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "10px", color: "#fff",
                      }}
                      title="Mark as correct"
                    >
                      {q.correctIndex === oi && "✓"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])}
            style={{
              width: "100%", padding: "12px", borderRadius: "10px",
              border: "1px dashed rgba(168,85,247,0.3)", background: "transparent",
              color: "#A855F7", fontSize: "12px", cursor: "pointer", transition: "all 0.2s",
              fontFamily: "var(--font-display)", letterSpacing: "0.1em",
            }}
          >
            + ADD QUESTION
          </button>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button type="button" onClick={() => router.back()} style={{ padding: "10px 24px", borderRadius: "10px", border: "1px solid rgba(168,85,247,0.2)", background: "transparent", color: "rgba(245,245,245,0.5)", fontSize: "12px", cursor: "pointer", fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}>CANCEL</button>
          <button type="submit" disabled={saving} style={{ padding: "10px 24px", borderRadius: "10px", background: "linear-gradient(135deg, #6B21A8, #A855F7)", color: "#fff", fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.1em", border: "none", cursor: "pointer", fontWeight: 600, opacity: saving ? 0.6 : 1 }}>
            {saving ? "SAVING..." : "CREATE QUIZ"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
