"use client";

import { useState } from "react";
import Link from "next/link";
import { saveAuth } from "@/lib/auth";
import { API_URL } from "@/lib/api";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin ? { email, password } : { name, email, password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || (isLogin ? "Login gagal" : "Registrasi gagal"));
      }

      if (isLogin) {
        saveAuth(result.token, result.user);
        setSuccess("Login berhasil! Mengalihkan...");
        setTimeout(() => {
          window.location.href = "/mahasiswa";
        }, 1000);
      } else {
        setSuccess("Registrasi berhasil! Silakan login.");
        setIsLogin(true);
        setName("");
        setPassword("");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
      setLoading(false);
    }
  };

  return (
    <main className="hero-wrapper animate-fade-in" style={{ padding: "20px" }}>
      <div className="card" style={{ width: "100%", maxWidth: "420px", padding: "32px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "1.875rem", marginBottom: "6px" }}>
            {isLogin ? "Selamat Datang" : "Buat Akun Baru"}
          </h1>
          <p style={{ fontSize: "0.875rem" }}>
            {isLogin ? "Masuk ke Panel Akademik Mahasiswa" : "Daftarkan akun untuk mengakses panel"}
          </p>
        </div>

        {error && (
          <div className="message error" style={{ margin: "0 0 20px 0" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span style={{ fontSize: "0.875rem" }}>{error}</span>
          </div>
        )}

        {success && (
          <div className="message success" style={{ margin: "0 0 20px 0" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span style={{ fontSize: "0.875rem" }}>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {!isLogin && (
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Alamat Email</label>
            <input
              type="email"
              placeholder="nama@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", marginTop: "8px", padding: "12px" }}>
            {loading ? (
              <span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 1s linear infinite" }}></span>
            ) : isLogin ? (
              "Masuk"
            ) : (
              "Daftar"
            )}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
            }}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: "var(--primary)",
              textDecoration: "underline",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.875rem",
              display: "inline",
            }}
          >
            {isLogin ? "Daftar di sini" : "Masuk di sini"}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <Link href="/" style={{ fontSize: "0.8125rem", color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
