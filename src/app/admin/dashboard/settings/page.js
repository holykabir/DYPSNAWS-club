"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(168,85,247,0.15)", color: "#F5F5F5", fontSize: "13px", outline: "none" };
const labelStyle = { display: "block", fontSize: "10px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: "rgba(168,85,247,0.5)", marginBottom: "8px" };

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (!currentPassword) {
      setMessage({ type: "error", text: "Current password is required" });
      return;
    }

    setSaving(true);

    try {
      const payload = { currentPassword };
      if (newEmail) payload.newEmail = newEmail;
      if (newPassword) payload.newPassword = newPassword;

      const res = await fetch("/api/auth/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Credentials updated successfully! Please re-login with your new credentials." });
        setCurrentPassword("");
        setNewEmail("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="SETTINGS" subtitle="Change admin credentials">
      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        {message.text && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              background: message.type === "success" ? "rgba(72,187,120,0.1)" : "rgba(245,100,100,0.1)",
              border: `1px solid ${message.type === "success" ? "rgba(72,187,120,0.2)" : "rgba(245,100,100,0.2)"}`,
              color: message.type === "success" ? "#48BB78" : "#F56565",
              fontSize: "13px",
              marginBottom: "20px",
            }}
          >
            {message.text}
          </div>
        )}

        <div style={{ background: "rgba(107,33,168,0.06)", border: "1px solid rgba(168,85,247,0.12)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: "rgba(245,245,245,0.4)", marginBottom: "20px" }}>
            CURRENT PASSWORD
          </h3>
          <div>
            <label style={labelStyle}>ENTER CURRENT PASSWORD TO CONFIRM</label>
            <input
              style={inputStyle}
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              required
            />
          </div>
        </div>

        <div style={{ background: "rgba(107,33,168,0.06)", border: "1px solid rgba(168,85,247,0.12)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: "rgba(245,245,245,0.4)", marginBottom: "20px" }}>
            CHANGE EMAIL
          </h3>
          <div>
            <label style={labelStyle}>NEW EMAIL (leave blank to keep current)</label>
            <input
              style={inputStyle}
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="new@email.com"
            />
          </div>
        </div>

        <div style={{ background: "rgba(107,33,168,0.06)", border: "1px solid rgba(168,85,247,0.12)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: "rgba(245,245,245,0.4)", marginBottom: "20px" }}>
            CHANGE PASSWORD
          </h3>
          <div style={{ display: "grid", gap: "16px" }}>
            <div>
              <label style={labelStyle}>NEW PASSWORD (leave blank to keep current)</label>
              <input
                style={inputStyle}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
              />
            </div>
            <div>
              <label style={labelStyle}>CONFIRM NEW PASSWORD</label>
              <input
                style={inputStyle}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "12px 28px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #6B21A8, #A855F7)",
            color: "#fff",
            fontSize: "12px",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.1em",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            opacity: saving ? 0.6 : 1,
            width: "100%",
          }}
        >
          {saving ? "UPDATING..." : "UPDATE CREDENTIALS"}
        </button>
      </form>
    </AdminLayout>
  );
}
