"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import FormFieldsEditor from "@/components/admin/FormFieldsEditor";

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(168,85,247,0.15)",
  color: "#F5F5F5",
  fontSize: "13px",
  outline: "none",
  transition: "border-color 0.3s",
};

const labelStyle = {
  display: "block",
  fontSize: "10px",
  fontFamily: "var(--font-display)",
  letterSpacing: "0.15em",
  color: "rgba(168,85,247,0.5)",
  marginBottom: "8px",
};

const EVENT_TYPES = ["WORKSHOP", "HACKATHON", "CERTIFICATION", "SUMMIT", "FESTIVAL"];
const EVENT_COLORS = ["#A855F7", "#7C3AED", "#9333EA", "#C084FC", "#8B5CF6"];

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(null);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${params.slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setForm({
            title: data.title || "",
            date: data.date || "",
            desc: data.desc || "",
            type: data.type || "WORKSHOP",
            color: data.color || "#A855F7",
            location: data.location || "",
            capacity: data.capacity || 50,
            prerequisites: data.prerequisites?.length ? data.prerequisites : [""],
            schedule: data.schedule?.length ? data.schedule : [{ time: "", topic: "" }],
            speakers: data.speakers?.length ? data.speakers : [{ name: "", role: "", topic: "" }],
            formFields: data.formFields?.length ? data.formFields : [],
            featured: data.featured !== false,
            status: data.status || "Upcoming",
          });
          setImages(data.images || []);
          setVideos(data.videos || []);
        }
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleFileUpload = async (files, type) => {
    if (type === "image") setUploadingImages(true);
    const urls = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        urls.push(data.url);
      }
    }
    if (type === "image") {
      setImages((p) => [...p, ...urls]);
      setUploadingImages(false);
    } else {
      setVideos((p) => [...p, ...urls]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      capacity: Number(form.capacity),
      prerequisites: form.prerequisites.filter((p) => p.trim()),
      schedule: form.schedule.filter((s) => s.time.trim() || s.topic.trim()),
      speakers: form.speakers.filter((s) => s.name.trim()),
      formFields: form.formFields.filter((f) => f.label.trim()),
      images,
      videos,
    };

    try {
      const res = await fetch(`/api/events/${params.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/admin/dashboard/events");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update event");
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="EDIT EVENT" subtitle="Loading...">
        <div style={{ textAlign: "center", padding: "60px", color: "rgba(245,245,245,0.3)" }}>Loading...</div>
      </AdminLayout>
    );
  }

  if (!form) {
    return (
      <AdminLayout title="EVENT NOT FOUND" subtitle="">
        <div style={{ textAlign: "center", padding: "60px", color: "rgba(245,245,245,0.3)" }}>{error || "Event not found"}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="EDIT EVENT" subtitle={`Editing: ${form.title}`}>
      <form onSubmit={handleSubmit} style={{ maxWidth: "800px" }}>
        {error && (
          <div style={{ padding: "10px 16px", borderRadius: "10px", background: "rgba(245,100,100,0.1)", border: "1px solid rgba(245,100,100,0.2)", color: "#F56565", fontSize: "13px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div style={{ background: "rgba(107,33,168,0.06)", border: "1px solid rgba(168,85,247,0.12)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: "rgba(245,245,245,0.4)", marginBottom: "20px" }}>BASIC INFO</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>TITLE</label>
              <input style={inputStyle} value={form.title} onChange={(e) => update("title", e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>DATE</label>
              <input style={inputStyle} value={form.date} onChange={(e) => update("date", e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>LOCATION</label>
              <input style={inputStyle} value={form.location} onChange={(e) => update("location", e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>TYPE</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.type} onChange={(e) => { update("type", e.target.value); update("color", EVENT_COLORS[EVENT_TYPES.indexOf(e.target.value)] || "#A855F7"); }}>
                {EVENT_TYPES.map((t) => (<option key={t} value={t} style={{ background: "#1a1a2e" }}>{t}</option>))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>STATUS</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.status} onChange={(e) => update("status", e.target.value)}>
                {["Upcoming", "Ongoing", "Completed"].map((s) => (<option key={s} value={s} style={{ background: "#1a1a2e" }}>{s}</option>))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>CAPACITY</label>
              <input style={inputStyle} type="number" value={form.capacity} onChange={(e) => update("capacity", e.target.value)} min="1" required />
            </div>
            <div style={{ display: "flex", alignItems: "center", paddingTop: "20px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <div
                  onClick={() => update("featured", !form.featured)}
                  style={{
                    width: "40px", height: "22px", borderRadius: "11px", position: "relative", cursor: "pointer",
                    background: form.featured ? "linear-gradient(135deg, #6B21A8, #A855F7)" : "rgba(255,255,255,0.08)",
                    border: `1px solid ${form.featured ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.1)"}`,
                    transition: "all 0.3s",
                  }}
                >
                  <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#fff", position: "absolute", top: "2px", left: form.featured ? "20px" : "2px", transition: "left 0.3s" }} />
                </div>
                <span style={{ fontSize: "11px", color: form.featured ? "#A855F7" : "rgba(245,245,245,0.3)", fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}>SHOW ON HOMEPAGE</span>
              </label>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>DESCRIPTION</label>
              <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} value={form.desc} onChange={(e) => update("desc", e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>ACCENT COLOR</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {EVENT_COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => update("color", c)} style={{ width: "28px", height: "28px", borderRadius: "8px", background: c, border: form.color === c ? "2px solid #fff" : "2px solid transparent", cursor: "pointer" }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div style={{ background: "rgba(107,33,168,0.06)", border: "1px solid rgba(168,85,247,0.12)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: "rgba(245,245,245,0.4)", marginBottom: "20px" }}>SCHEDULE</h3>
          {form.schedule.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "center" }}>
              <input style={{ ...inputStyle, width: "160px", flexShrink: 0 }} value={item.time} onChange={(e) => { const s = [...form.schedule]; s[i] = { ...s[i], time: e.target.value }; update("schedule", s); }} placeholder="10:00 AM" />
              <input style={inputStyle} value={item.topic} onChange={(e) => { const s = [...form.schedule]; s[i] = { ...s[i], topic: e.target.value }; update("schedule", s); }} placeholder="Topic" />
              {form.schedule.length > 1 && (<button type="button" onClick={() => update("schedule", form.schedule.filter((_, j) => j !== i))} style={{ color: "rgba(245,100,100,0.6)", background: "none", border: "none", cursor: "pointer", fontSize: "18px", flexShrink: 0 }}>×</button>)}
            </div>
          ))}
          <button type="button" onClick={() => update("schedule", [...form.schedule, { time: "", topic: "" }])} style={{ color: "#A855F7", background: "none", border: "none", cursor: "pointer", fontSize: "12px", marginTop: "4px" }}>+ Add time slot</button>
        </div>

        {/* Speakers */}
        <div style={{ background: "rgba(107,33,168,0.06)", border: "1px solid rgba(168,85,247,0.12)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: "rgba(245,245,245,0.4)", marginBottom: "20px" }}>SPEAKERS</h3>
          {form.speakers.map((sp, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "center" }}>
              <input style={{ ...inputStyle, flex: 1 }} value={sp.name} onChange={(e) => { const s = [...form.speakers]; s[i] = { ...s[i], name: e.target.value }; update("speakers", s); }} placeholder="Name" />
              <input style={{ ...inputStyle, flex: 1 }} value={sp.role} onChange={(e) => { const s = [...form.speakers]; s[i] = { ...s[i], role: e.target.value }; update("speakers", s); }} placeholder="Role" />
              <input style={{ ...inputStyle, flex: 1 }} value={sp.topic} onChange={(e) => { const s = [...form.speakers]; s[i] = { ...s[i], topic: e.target.value }; update("speakers", s); }} placeholder="Topic" />
              {form.speakers.length > 1 && (<button type="button" onClick={() => update("speakers", form.speakers.filter((_, j) => j !== i))} style={{ color: "rgba(245,100,100,0.6)", background: "none", border: "none", cursor: "pointer", fontSize: "18px", flexShrink: 0 }}>×</button>)}
            </div>
          ))}
          <button type="button" onClick={() => update("speakers", [...form.speakers, { name: "", role: "", topic: "" }])} style={{ color: "#A855F7", background: "none", border: "none", cursor: "pointer", fontSize: "12px", marginTop: "4px" }}>+ Add speaker</button>
        </div>

        {/* Prerequisites */}
        <div style={{ background: "rgba(107,33,168,0.06)", border: "1px solid rgba(168,85,247,0.12)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: "rgba(245,245,245,0.4)", marginBottom: "20px" }}>PREREQUISITES</h3>
          {form.prerequisites.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "center" }}>
              <input style={inputStyle} value={p} onChange={(e) => { const arr = [...form.prerequisites]; arr[i] = e.target.value; update("prerequisites", arr); }} placeholder="Prerequisite" />
              {form.prerequisites.length > 1 && (<button type="button" onClick={() => update("prerequisites", form.prerequisites.filter((_, j) => j !== i))} style={{ color: "rgba(245,100,100,0.6)", background: "none", border: "none", cursor: "pointer", fontSize: "18px", flexShrink: 0 }}>×</button>)}
            </div>
          ))}
          <button type="button" onClick={() => update("prerequisites", [...form.prerequisites, ""])} style={{ color: "#A855F7", background: "none", border: "none", cursor: "pointer", fontSize: "12px", marginTop: "4px" }}>+ Add prerequisite</button>
        </div>

        {/* Registration Form Fields */}
        <FormFieldsEditor fields={form.formFields} onChange={(f) => update("formFields", f)} />

        {/* Media */}
        <div style={{ background: "rgba(107,33,168,0.06)", border: "1px solid rgba(168,85,247,0.12)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: "rgba(245,245,245,0.4)", marginBottom: "20px" }}>MEDIA</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={labelStyle}>IMAGES</label>
              <input type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(Array.from(e.target.files), "image")} style={{ ...inputStyle, cursor: "pointer" }} />
              {uploadingImages && <p style={{ fontSize: "11px", color: "#A855F7", marginTop: "4px" }}>Uploading...</p>}
              <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                {images.map((url, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <img src={url} alt="" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(168,85,247,0.2)" }} />
                    <button type="button" onClick={() => setImages((p) => p.filter((_, j) => j !== i))} style={{ position: "absolute", top: "-6px", right: "-6px", width: "18px", height: "18px", borderRadius: "50%", background: "#F56565", color: "#fff", border: "none", cursor: "pointer", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>VIDEOS</label>
              <input type="file" accept="video/*" multiple onChange={(e) => handleFileUpload(Array.from(e.target.files), "video")} style={{ ...inputStyle, cursor: "pointer" }} />
              {videos.length > 0 && (
                <div style={{ marginTop: "8px" }}>
                  {videos.map((url, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "rgba(245,245,245,0.5)", marginBottom: "4px" }}>
                      <span>📹 {url.split("/").pop()}</span>
                      <button type="button" onClick={() => setVideos((p) => p.filter((_, j) => j !== i))} style={{ color: "#F56565", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button type="button" onClick={() => router.back()} style={{ padding: "10px 24px", borderRadius: "10px", border: "1px solid rgba(168,85,247,0.2)", background: "transparent", color: "rgba(245,245,245,0.5)", fontSize: "12px", cursor: "pointer", fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}>CANCEL</button>
          <button type="submit" disabled={saving} style={{ padding: "10px 24px", borderRadius: "10px", background: "linear-gradient(135deg, #6B21A8, #A855F7)", color: "#fff", fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.1em", border: "none", cursor: "pointer", fontWeight: 600, opacity: saving ? 0.6 : 1 }}>
            {saving ? "SAVING..." : "UPDATE EVENT"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
