import { Suspense } from "react";
import AdminPageClient from "./AdminPageClient";

export const metadata = {
  title: "Admin Login | AWS Cloud Club",
  description: "Admin panel login for the AWS Cloud Club.",
};

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0A0A0F",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              border: "3px solid rgba(168,85,247,0.2)",
              borderTopColor: "#A855F7",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      }
    >
      <AdminPageClient />
    </Suspense>
  );
}
