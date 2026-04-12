"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import SmoothScroller from "@/components/SmoothScroller";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";

const inputStyle = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(168,85,247,0.15)",
  color: "#F5F5F5",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.3s, box-shadow 0.3s",
};

export default function EventRegisterPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [uploadingField, setUploadingField] = useState(null);

  const handleImageUpload = async (file, fieldLabel) => {
    setUploadingField(fieldLabel);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        setFormData((p) => ({ ...p, [fieldLabel]: data.url }));
      } else {
        setError("Image upload failed");
      }
    } catch {
      setError("Image upload failed");
    } finally {
      setUploadingField(null);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        // Get user
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
          // Not signed in — redirect to event page
          router.replace(`/events/${params.slug}?login=required`);
          return;
        }
        setUser(authUser);

        // Get event
        const eventRes = await fetch(`/api/events/${params.slug}`);
        const eventData = await eventRes.json();
        if (eventData.error) {
          setError("Event not found");
          setLoading(false);
          return;
        }
        setEvent(eventData);

        // Check if already registered
        const regRes = await fetch(`/api/registrations/${params.slug}`);
        const regData = await regRes.json();
        if (regData.registered) {
          setAlreadyRegistered(true);
        }

        // Pre-fill form with defaults
        const defaults = {};
        (eventData.formFields || []).forEach((field) => {
          defaults[field.label] = "";
        });
        setFormData(defaults);
      } catch {
        setError("Failed to load");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.slug, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventSlug: params.slug,
          userName: user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email,
          formData,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        if (res.status === 409) {
          setAlreadyRegistered(true);
        } else {
          setError(data.error || "Registration failed");
        }
      }
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SmoothScroller>
        <PageTransition>
          <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0A0A0F" }}>
            <div style={{ width: "36px", height: "36px", border: "3px solid rgba(168,85,247,0.2)", borderTopColor: "#A855F7", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        </PageTransition>
      </SmoothScroller>
    );
  }

  if (!event) {
    return (
      <SmoothScroller>
        <PageTransition>
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0A0A0F", color: "rgba(245,245,245,0.5)" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "12px" }}>Event Not Found</h1>
            <Link href="/events" style={{ color: "#A855F7", fontSize: "13px" }}>← Back to Events</Link>
          </div>
        </PageTransition>
      </SmoothScroller>
    );
  }

  return (
    <SmoothScroller>
      <PageTransition>
        {/* Background */}
        <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(107,33,168,0.25) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(168,85,247,0.08) 0%, transparent 50%), #0A0A0F" }} />

        <div className="relative z-10 min-h-screen">
          <div style={{ maxWidth: "640px", margin: "0 auto", padding: "120px 24px 80px" }}>
            {/* Back link */}
            <Link
              href={`/events/${params.slug}`}
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-purple-light/40 hover:text-purple-light transition-colors mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ← BACK TO EVENT
            </Link>

            {/* Event info header */}
            <div style={{ marginBottom: "32px" }}>
              <span style={{ display: "inline-block", padding: "4px 14px", borderRadius: "999px", fontSize: "10px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: event.color, border: `1px solid ${event.color}40`, background: `${event.color}10`, marginBottom: "12px" }}>
                {event.type}
              </span>
              <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800, color: "#F5F5F5", fontFamily: "var(--font-display)", marginBottom: "8px", lineHeight: 1.1 }}>
                {event.title}
              </h1>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "13px", color: "rgba(245,245,245,0.4)" }}>
                <span>📅 {event.date}</span>
                <span>📍 {event.location}</span>
                <span>👥 {event.capacity} seats</span>
              </div>
            </div>

            {/* Already registered */}
            {alreadyRegistered && !success && (
              <div style={{
                padding: "32px",
                borderRadius: "16px",
                background: "rgba(72,187,120,0.08)",
                border: "1px solid rgba(72,187,120,0.2)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
                <h2 style={{ fontSize: "20px", color: "#48BB78", fontFamily: "var(--font-display)", marginBottom: "8px" }}>
                  ALREADY REGISTERED
                </h2>
                <p style={{ color: "rgba(245,245,245,0.4)", fontSize: "14px", marginBottom: "20px" }}>
                  You have already registered for this event.
                </p>
                <Link
                  href={`/events/${params.slug}`}
                  style={{ color: "#A855F7", fontSize: "13px", fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}
                >
                  ← BACK TO EVENT
                </Link>
              </div>
            )}

            {/* Success */}
            {success && (
              <div style={{
                padding: "40px",
                borderRadius: "16px",
                background: "rgba(72,187,120,0.08)",
                border: "1px solid rgba(72,187,120,0.2)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
                <h2 style={{ fontSize: "24px", color: "#48BB78", fontFamily: "var(--font-display)", marginBottom: "8px" }}>
                  REGISTRATION COMPLETE
                </h2>
                <p style={{ color: "rgba(245,245,245,0.4)", fontSize: "14px", marginBottom: "8px" }}>
                  You&apos;re registered for <strong style={{ color: "#F5F5F5" }}>{event.title}</strong>
                </p>
                <p style={{ color: "rgba(245,245,245,0.3)", fontSize: "12px", marginBottom: "24px" }}>
                  A confirmation has been saved. See you there!
                </p>
                <Link
                  href={`/events/${params.slug}`}
                  style={{ display: "inline-block", padding: "10px 28px", borderRadius: "10px", background: "linear-gradient(135deg, #6B21A8, #A855F7)", color: "#fff", fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.1em", textDecoration: "none" }}
                >
                  VIEW EVENT
                </Link>
              </div>
            )}

            {/* Registration form */}
            {!alreadyRegistered && !success && (
              <form onSubmit={handleSubmit}>
                <div style={{
                  background: "rgba(168,85,247,0.04)",
                  border: "1px solid rgba(168,85,247,0.12)",
                  borderRadius: "20px",
                  padding: "32px",
                  marginBottom: "20px",
                }}>
                  <h2 style={{ fontSize: "14px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: "rgba(245,245,245,0.4)", marginBottom: "24px" }}>
                    REGISTRATION FORM
                  </h2>

                  {/* Auto-filled fields */}
                  <div style={{ display: "grid", gap: "20px", marginBottom: "24px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--font-display)", letterSpacing: "0.12em", color: "rgba(168,85,247,0.5)", marginBottom: "8px" }}>
                        EMAIL (from Google)
                      </label>
                      <div style={{ ...inputStyle, background: "rgba(168,85,247,0.06)", color: "rgba(245,245,245,0.5)", cursor: "not-allowed" }}>
                        {user?.email}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--font-display)", letterSpacing: "0.12em", color: "rgba(168,85,247,0.5)", marginBottom: "8px" }}>
                        NAME (from Google)
                      </label>
                      <div style={{ ...inputStyle, background: "rgba(168,85,247,0.06)", color: "rgba(245,245,245,0.5)", cursor: "not-allowed" }}>
                        {user?.user_metadata?.full_name || user?.user_metadata?.name || "—"}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  {event.formFields && event.formFields.length > 0 && (
                    <div style={{ borderTop: "1px solid rgba(168,85,247,0.1)", margin: "20px 0" }} />
                  )}

                  {/* Dynamic form fields */}
                  <div style={{ display: "grid", gap: "20px" }}>
                    {(event.formFields || []).map((field, i) => (
                      <div key={i}>
                        <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--font-display)", letterSpacing: "0.12em", color: "rgba(168,85,247,0.5)", marginBottom: "8px" }}>
                          {field.label.toUpperCase()}{field.required && <span style={{ color: "#F56565" }}> *</span>}
                        </label>

                        {field.type === "textarea" ? (
                          <textarea
                            style={{
                              ...inputStyle,
                              minHeight: "80px",
                              resize: "vertical",
                              borderColor: focusedField === i ? "rgba(168,85,247,0.5)" : "rgba(168,85,247,0.15)",
                              boxShadow: focusedField === i ? "0 0 20px rgba(168,85,247,0.1)" : "none",
                            }}
                            value={formData[field.label] || ""}
                            onChange={(e) => setFormData((p) => ({ ...p, [field.label]: e.target.value }))}
                            onFocus={() => setFocusedField(i)}
                            onBlur={() => setFocusedField(null)}
                            required={field.required}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                          />
                        ) : field.type === "select" ? (
                          <select
                            style={{
                              ...inputStyle,
                              cursor: "pointer",
                              borderColor: focusedField === i ? "rgba(168,85,247,0.5)" : "rgba(168,85,247,0.15)",
                              boxShadow: focusedField === i ? "0 0 20px rgba(168,85,247,0.1)" : "none",
                            }}
                            value={formData[field.label] || ""}
                            onChange={(e) => setFormData((p) => ({ ...p, [field.label]: e.target.value }))}
                            onFocus={() => setFocusedField(i)}
                            onBlur={() => setFocusedField(null)}
                            required={field.required}
                          >
                            <option value="" style={{ background: "#1a1a2e" }}>Select {field.label.toLowerCase()}</option>
                            {(field.options || "").split(",").map((opt) => opt.trim()).filter(Boolean).map((opt) => (
                              <option key={opt} value={opt} style={{ background: "#1a1a2e" }}>{opt}</option>
                            ))}
                          </select>
                        ) : field.type === "multiselect" ? (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {(field.options || "").split(",").map((opt) => opt.trim()).filter(Boolean).map((opt) => {
                              const selected = (formData[field.label] || "").split(",").map(s => s.trim()).filter(Boolean);
                              const isChecked = selected.includes(opt);
                              return (
                                <label
                                  key={opt}
                                  style={{
                                    display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px",
                                    borderRadius: "8px", cursor: "pointer", fontSize: "12px", transition: "all 0.2s",
                                    border: `1px solid ${isChecked ? "rgba(168,85,247,0.5)" : "rgba(168,85,247,0.15)"}`,
                                    background: isChecked ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.02)",
                                    color: isChecked ? "#A855F7" : "rgba(245,245,245,0.5)",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      const current = (formData[field.label] || "").split(",").map(s => s.trim()).filter(Boolean);
                                      const updated = isChecked ? current.filter(s => s !== opt) : [...current, opt];
                                      setFormData((p) => ({ ...p, [field.label]: updated.join(", ") }));
                                    }}
                                    style={{ accentColor: "#A855F7", width: "14px", height: "14px" }}
                                  />
                                  {opt}
                                </label>
                              );
                            })}
                            {field.required && !(formData[field.label] || "").trim() && (
                              <input type="text" required value="" style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} tabIndex={-1} />
                            )}
                          </div>
                        ) : field.type === "image" ? (
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files?.[0]) handleImageUpload(e.target.files[0], field.label);
                              }}
                              style={{
                                ...inputStyle,
                                cursor: "pointer",
                                borderColor: focusedField === i ? "rgba(168,85,247,0.5)" : "rgba(168,85,247,0.15)",
                              }}
                              required={field.required && !formData[field.label]}
                            />
                            {uploadingField === field.label && (
                              <p style={{ fontSize: "11px", color: "#A855F7", marginTop: "8px" }}>Uploading...</p>
                            )}
                            {formData[field.label] && (
                              <div style={{ marginTop: "10px", position: "relative", display: "inline-block" }}>
                                <img
                                  src={formData[field.label]}
                                  alt="Preview"
                                  style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "12px", border: "1px solid rgba(168,85,247,0.2)" }}
                                />
                                <button
                                  type="button"
                                  onClick={() => setFormData((p) => ({ ...p, [field.label]: "" }))}
                                  style={{ position: "absolute", top: "-6px", right: "-6px", width: "22px", height: "22px", borderRadius: "50%", background: "#F56565", color: "#fff", border: "none", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                  ×
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <input
                            type={field.type || "text"}
                            style={{
                              ...inputStyle,
                              borderColor: focusedField === i ? "rgba(168,85,247,0.5)" : "rgba(168,85,247,0.15)",
                              boxShadow: focusedField === i ? "0 0 20px rgba(168,85,247,0.1)" : "none",
                            }}
                            value={formData[field.label] || ""}
                            onChange={(e) => setFormData((p) => ({ ...p, [field.label]: e.target.value }))}
                            onFocus={() => setFocusedField(i)}
                            onBlur={() => setFocusedField(null)}
                            required={field.required}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(245,100,100,0.1)", border: "1px solid rgba(245,100,100,0.2)", color: "#F56565", fontSize: "13px", marginBottom: "16px", textAlign: "center" }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #6B21A8, #A855F7)",
                    color: "#fff",
                    fontSize: "14px",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.15em",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                    opacity: submitting ? 0.6 : 1,
                    transition: "all 0.3s",
                    boxShadow: "0 0 24px rgba(168,85,247,0.2)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 40px rgba(168,85,247,0.4)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 24px rgba(168,85,247,0.2)"; }}
                >
                  {submitting ? "REGISTERING..." : "CONFIRM REGISTRATION"}
                </button>
              </form>
            )}
          </div>

          <Footer />
        </div>
      </PageTransition>
    </SmoothScroller>
  );
}
