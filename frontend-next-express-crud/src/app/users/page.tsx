"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getToken, getUser, logout } from "@/lib/auth";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  User,
} from "@/lib/api";

export default function UsersPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "operator" | "viewer">("viewer");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Temporary password display from reset action
  const [tempPassword, setTempPassword] = useState("");

  // Auth check & redirection
  useEffect(() => {
    const token = getToken();
    const userObj = getUser();

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (userObj && userObj.role !== "admin") {
      // Hanya admin yang boleh masuk ke halaman ini
      alert("Akses ditolak: Hanya admin yang dapat mengelola data user.");
      window.location.href = "/mahasiswa";
      return;
    }

    setCurrentUser(userObj);
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setPassword(""); // Password tidak diubah lewat update biasa
    setMessage("");
    setError("");
    setTempPassword("");
  };

  const handleCancel = () => {
    setSelectedUser(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("viewer");
    setMessage("");
    setError("");
    setTempPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");
    setTempPassword("");

    try {
      if (selectedUser) {
        // Edit mode (PUT)
        await updateUser(selectedUser.id, { name, email, role });
        setMessage(`Data user "${name}" berhasil diperbarui.`);
        handleCancel();
      } else {
        // Create mode (POST)
        if (!password) {
          throw new Error("Password wajib diisi untuk user baru.");
        }
        await createUser({ name, email, password, role });
        setMessage(`User "${name}" berhasil ditambahkan.`);
        handleCancel();
      }
      await loadUsers();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (currentUser && currentUser.id === id) {
      alert("Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.");
      return;
    }

    const confirmed = window.confirm(`Yakin ingin menghapus user "${name}"?`);
    if (!confirmed) return;

    try {
      setMessage("");
      setError("");
      setTempPassword("");
      await deleteUser(id);
      setMessage(`User "${name}" berhasil dihapus.`);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || "Gagal menghapus user.");
    }
  };

  const handleResetPassword = async (id: number, name: string) => {
    const confirmed = window.confirm(
      `Yakin ingin mereset password untuk user "${name}"?`
    );
    if (!confirmed) return;

    try {
      setMessage("");
      setError("");
      setTempPassword("");
      const result = await resetPassword(id);
      setTempPassword(result.temporaryPassword);
      setMessage(`Password untuk user "${name}" berhasil direset.`);
      // Scroll to top to make sure they see the temporary password
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "Gagal mereset password.");
    }
  };

  return (
    <main className="container animate-fade-in">
      {/* Header */}
      <div className="header">
        <div>
          <h1>Kelola Pengguna</h1>
          <p style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <span className="badge badge-primary">
              <span style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "currentColor",
                marginRight: 2
              }}></span>
              Panel Manajemen User (Khusus Admin)
            </span>
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {currentUser && (
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Login sebagai: <strong>{currentUser.name}</strong> ({currentUser.role})
            </span>
          )}

          <Link href="/mahasiswa">
            <button className="btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Dashboard Mahasiswa
            </button>
          </Link>

          <button className="btn-danger" onClick={logout} style={{ padding: "8px 16px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Alerts */}
      {message && (
        <div className="message success">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <div>
            <p style={{ color: "#34d399", fontWeight: 600 }}>{message}</p>
          </div>
        </div>
      )}

      {tempPassword && (
        <div className="message info" style={{ borderLeftColor: "var(--warning)", background: "var(--warning-light)", color: "var(--warning)", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span style={{ fontWeight: 700, fontSize: "1rem" }}>PASSWORD BARU SEMENTARA BERHASIL DIBUAT</span>
          </div>
          <p style={{ color: "var(--text-primary)", marginTop: 4 }}>
            Salin password sementara di bawah ini untuk diberikan kepada pengguna. Password ini <strong>hanya ditampilkan sekali saja</strong>:
          </p>
          <div style={{
            background: "var(--bg-primary)",
            padding: "10px 14px",
            borderRadius: "6px",
            fontFamily: "var(--font-mono)",
            fontSize: "1.125rem",
            color: "#f59e0b",
            fontWeight: "bold",
            letterSpacing: "1px",
            border: "1px solid var(--border-color)",
            marginTop: 8,
            display: "inline-block"
          }}>
            {tempPassword}
          </div>
        </div>
      )}

      {error && (
        <div className="message error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid">
        {/* Left Side: Form */}
        <div className="card card-accent-primary">
          <h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            {selectedUser ? "Edit Data User" : "Tambah User Baru"}
          </h2>

          <form onSubmit={handleSubmit}>
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

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="email@kampus.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password input hanya muncul jika Create User */}
            {!selectedUser && (
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Masukkan password awal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={(e: any) => setRole(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="operator">Operator</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            <div className="actions">
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 1s linear infinite" }}></span>
                ) : selectedUser ? (
                  "Perbarui User"
                ) : (
                  "Simpan User"
                )}
              </button>

              {(selectedUser || name || email || password) && (
                <button type="button" className="btn-secondary" onClick={handleCancel}>
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side: Users List Table */}
        <div className="card">
          <h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Daftar Pengguna ({users.length})
          </h2>

          {loading ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-secondary)" }}>
              <div style={{
                display: "inline-block",
                width: 24,
                height: 24,
                border: "3px solid rgba(99, 102, 241, 0.2)",
                borderTopColor: "var(--primary)",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: 8
              }}></div>
              <p style={{ fontSize: "0.875rem" }}>Mengambil data user...</p>
            </div>
          ) : users.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)" }}>
              Tidak ada data user.
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="avatar">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${
                          user.role === "admin"
                            ? "badge-success"
                            : user.role === "operator"
                            ? "badge-primary"
                            : "badge-info"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            className="btn-secondary"
                            onClick={() => handleEdit(user)}
                            style={{ padding: "6px 10px", fontSize: "0.75rem" }}
                            title="Edit"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>

                          <button
                            className="btn-danger"
                            onClick={() => handleDelete(user.id, user.name)}
                            style={{ padding: "6px 10px", fontSize: "0.75rem" }}
                            disabled={currentUser && currentUser.id === user.id}
                            title="Hapus"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>

                          <button
                            className="btn-secondary"
                            onClick={() => handleResetPassword(user.id, user.name)}
                            style={{ padding: "6px 10px", fontSize: "0.75rem", borderColor: "rgba(245, 158, 11, 0.2)", color: "var(--warning)" }}
                            title="Reset Password"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
