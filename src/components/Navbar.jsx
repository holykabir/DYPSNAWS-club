"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Don't show navbar on the landing page (it has its own nav)
  if (isHome) return null;

  const links = [
    { label: "HOME", href: "/" },
    { label: "EVENTS", href: "/events" },
    { label: "TEAM", href: "/team" },
    { label: "CERTS", href: "/certifications" },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[9998] px-2 py-2 rounded-full glass-card flex items-center gap-1">
      {links.map((link) => {
        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-5 py-2 rounded-full text-[11px] tracking-[0.2em] font-semibold transition-all duration-300 ${
              isActive
                ? "bg-purple-deep text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                : "text-off-white/50 hover:text-off-white hover:bg-white/5"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
