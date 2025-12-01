"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        background: "rgba(11, 18, 32, 0.95)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        {/* Logo / Brand */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: "#e8edf5",
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #3b82f6, #22c55e)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#0b1220",
            }}
          >
            G
          </span>
          <span style={{ fontWeight: 600, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
            Ghuman Analytics
          </span>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  color: isActive ? "#fff" : "#94a3b8",
                  background: isActive ? "rgba(59, 130, 246, 0.2)" : "transparent",
                  border: isActive ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

