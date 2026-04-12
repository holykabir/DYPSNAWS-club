"use client";

import AdminGuard from "./AdminGuard";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children, title, subtitle }) {
  return (
    <AdminGuard>
      <div style={{ display: "flex", minHeight: "100vh", background: "#0A0A0F" }}>
        <AdminSidebar />
        <main
          style={{
            flex: 1,
            marginLeft: "260px",
            padding: "32px",
            minHeight: "100vh",
          }}
        >
          {/* Page header */}
          {title && (
            <div style={{ marginBottom: "32px" }}>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#F5F5F5",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.05em",
                  marginBottom: "4px",
                }}
              >
                {title}
              </h1>
              {subtitle && (
                <p style={{ fontSize: "13px", color: "rgba(245,245,245,0.35)" }}>{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
