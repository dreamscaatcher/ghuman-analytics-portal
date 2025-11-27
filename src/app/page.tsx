import Link from "next/link";

const navStyles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky" as const,
    top: 0,
    background: "#fff",
    zIndex: 10,
  },
  brand: { fontWeight: 800, fontSize: "1.125rem", letterSpacing: "0.02em" },
  navList: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    listStyle: "none",
    margin: 0,
    padding: 0,
    color: "#374151",
  },
  ctaRow: { display: "flex", alignItems: "center", gap: "12px" },
  buttonPrimary: {
    padding: "10px 16px",
    borderRadius: "999px",
    border: "1px solid #0f766e",
    background: "#0f766e",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  },
  buttonGhost: {
    padding: "10px 16px",
    borderRadius: "999px",
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#111827",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default function Page() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", minHeight: "100vh", background: "#f9fafb" }}>
      <header style={navStyles.wrapper}>
        <div style={navStyles.brand}>Ghuman Restaurant</div>
        <nav aria-label="Primary">
          <ul style={navStyles.navList}>
            <li>Menu</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </nav>
        <div style={navStyles.ctaRow}>
          <button type="button" style={navStyles.buttonGhost}>
            Sign in
          </button>
          <Link href="/register" style={navStyles.buttonPrimary}>
            Register Here
          </Link>
        </div>
      </header>

      <main style={{ padding: "64px 24px", display: "grid", placeItems: "center" }} />
    </div>
  );
}
