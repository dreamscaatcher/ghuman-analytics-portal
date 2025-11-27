"use client";

import type { CSSProperties, FormEvent } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const containerStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#f9fafb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px 16px",
  fontFamily: "Inter, system-ui, sans-serif",
};

const cardStyle: CSSProperties = {
  width: "100%",
  maxWidth: 440,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  padding: 24,
};

const labelStyle: CSSProperties = {
  display: "block",
  fontWeight: 600,
  color: "#111827",
  marginBottom: 6,
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#111827",
  fontSize: "0.95rem",
  outline: "none",
};

const buttonStyle: CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 999,
  border: "1px solid #0f766e",
  background: "#0f766e",
  color: "#fff",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
};

const mutedText: CSSProperties = { color: "#6b7280", fontSize: "0.95rem" };

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmitDisabled = useMemo(
    () => !form.name || !form.email || !form.password || form.password !== form.confirmPassword,
    [form],
  );

  const handleChange =
    (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      setMessage("");
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords must match.");
      return;
    }

    setIsSubmitting(true);
    fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(body?.error || "Registration failed");
        }
        setMessage("Registration saved!");
        setForm({ name: "", email: "", password: "", confirmPassword: "" });
        router.replace("/");
      })
      .catch((err: Error) => {
        setError(err.message || "Registration failed");
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "#111827" }}>Register</h1>
          <Link href="/" style={{ color: "#0f766e", fontWeight: 600 }}>
            Back home
          </Link>
        </div>
        <p style={mutedText}>Create your account to start ordering.</p>

        <form onSubmit={handleSubmit} style={{ marginTop: 16, display: "grid", gap: 14 }}>
          <label>
            <span style={labelStyle}>Full name</span>
            <input
              required
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange("name")}
              style={inputStyle}
              placeholder="Ghuman Singh"
            />
          </label>

          <label>
            <span style={labelStyle}>Email</span>
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange("email")}
              style={inputStyle}
              placeholder="you@example.com"
            />
          </label>

          <label>
            <span style={labelStyle}>Password</span>
            <input
              required
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange("password")}
              style={inputStyle}
              placeholder="At least 8 characters"
              minLength={8}
            />
          </label>

          <label>
            <span style={labelStyle}>Confirm password</span>
            <input
              required
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              style={inputStyle}
              placeholder="Re-enter your password"
              minLength={8}
            />
          </label>

          <button type="submit" style={buttonStyle} disabled={isSubmitDisabled || isSubmitting}>
            {isSubmitting ? "Saving..." : "Register"}
          </button>

          {message ? (
            <p style={{ ...mutedText, color: "#0f766e", fontWeight: 600, margin: 0 }}>{message}</p>
          ) : null}
          {error ? (
            <p style={{ ...mutedText, color: "#b91c1c", fontWeight: 600, margin: 0 }}>{error}</p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
