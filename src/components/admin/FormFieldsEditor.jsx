"use client";

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone" },
  { value: "number", label: "Number" },
  { value: "select", label: "Dropdown" },
  { value: "multiselect", label: "Multi Select" },
  { value: "textarea", label: "Long Text" },
  { value: "image", label: "Image Upload" },
];

const inputStyle = { width: "100%", padding: "8px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(168,85,247,0.15)", color: "#F5F5F5", fontSize: "12px", outline: "none" };
const labelStyleSm = { display: "block", fontSize: "9px", fontFamily: "var(--font-display)", letterSpacing: "0.12em", color: "rgba(168,85,247,0.4)", marginBottom: "4px" };

export default function FormFieldsEditor({ fields, onChange }) {
  const addField = () => {
    onChange([...fields, { label: "", type: "text", required: false, options: "" }]);
  };

  const updateField = (index, key, value) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: value };
    onChange(updated);
  };

  const removeField = (index) => {
    onChange(fields.filter((_, i) => i !== index));
  };

  const moveField = (index, direction) => {
    const updated = [...fields];
    const target = index + direction;
    if (target < 0 || target >= updated.length) return;
    [updated[index], updated[target]] = [updated[target], updated[index]];
    onChange(updated);
  };

  return (
    <div
      style={{
        background: "rgba(107,33,168,0.06)",
        border: "1px solid rgba(168,85,247,0.12)",
        borderRadius: "16px",
        padding: "28px",
        marginBottom: "20px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "12px", fontFamily: "var(--font-display)", letterSpacing: "0.15em", color: "rgba(245,245,245,0.4)" }}>
          REGISTRATION FORM FIELDS
        </h3>
        <span style={{ fontSize: "10px", color: "rgba(245,245,245,0.25)" }}>
          {fields.length} field{fields.length !== 1 ? "s" : ""}
        </span>
      </div>

      <p style={{ fontSize: "11px", color: "rgba(245,245,245,0.25)", marginBottom: "16px", lineHeight: 1.5 }}>
        Define the fields users must fill out when registering. Email and Name are auto-filled from Google.
      </p>

      {fields.map((field, i) => (
        <div
          key={i}
          style={{
            background: "rgba(168,85,247,0.04)",
            border: "1px solid rgba(168,85,247,0.1)",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "10px",
          }}
        >
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "8px" }}>
            {/* Reorder buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", paddingTop: "14px" }}>
              <button type="button" onClick={() => moveField(i, -1)} disabled={i === 0} style={{ background: "none", border: "none", color: i === 0 ? "rgba(245,245,245,0.1)" : "rgba(245,245,245,0.3)", cursor: i === 0 ? "default" : "pointer", fontSize: "10px", padding: 0, lineHeight: 1 }}>▲</button>
              <button type="button" onClick={() => moveField(i, 1)} disabled={i === fields.length - 1} style={{ background: "none", border: "none", color: i === fields.length - 1 ? "rgba(245,245,245,0.1)" : "rgba(245,245,245,0.3)", cursor: i === fields.length - 1 ? "default" : "pointer", fontSize: "10px", padding: 0, lineHeight: 1 }}>▼</button>
            </div>

            {/* Field label */}
            <div style={{ flex: 2 }}>
              <label style={labelStyleSm}>FIELD LABEL</label>
              <input
                style={inputStyle}
                value={field.label}
                onChange={(e) => updateField(i, "label", e.target.value)}
                placeholder="e.g., Phone Number"
              />
            </div>

            {/* Field type */}
            <div style={{ flex: 1 }}>
              <label style={labelStyleSm}>TYPE</label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={field.type}
                onChange={(e) => updateField(i, "type", e.target.value)}
              >
                {FIELD_TYPES.map((t) => (
                  <option key={t.value} value={t.value} style={{ background: "#1a1a2e" }}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Required toggle */}
            <div style={{ paddingTop: "14px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "11px", color: field.required ? "#A855F7" : "rgba(245,245,245,0.3)" }}>
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => updateField(i, "required", e.target.checked)}
                  style={{ accentColor: "#A855F7" }}
                />
                Required
              </label>
            </div>

            {/* Delete */}
            <button
              type="button"
              onClick={() => removeField(i)}
              style={{ color: "rgba(245,100,100,0.5)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", paddingTop: "14px" }}
            >
              ×
            </button>
          </div>

          {/* Options input for select/multiselect type */}
          {(field.type === "select" || field.type === "multiselect") && (
            <div style={{ marginLeft: "26px" }}>
              <label style={labelStyleSm}>OPTIONS (comma-separated)</label>
              <input
                style={inputStyle}
                value={field.options || ""}
                onChange={(e) => updateField(i, "options", e.target.value)}
                placeholder="Option 1, Option 2, Option 3"
              />
              {field.type === "multiselect" && (
                <span style={{ fontSize: "10px", color: "rgba(245,245,245,0.2)", marginTop: "4px", display: "block" }}>
                  Users can select multiple options from this list.
                </span>
              )}
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addField}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "#A855F7",
          background: "none",
          border: "1px dashed rgba(168,85,247,0.3)",
          borderRadius: "10px",
          padding: "10px 16px",
          cursor: "pointer",
          fontSize: "12px",
          width: "100%",
          justifyContent: "center",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(168,85,247,0.6)"; e.currentTarget.style.background = "rgba(168,85,247,0.05)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"; e.currentTarget.style.background = "none"; }}
      >
        + Add Form Field
      </button>
    </div>
  );
}
