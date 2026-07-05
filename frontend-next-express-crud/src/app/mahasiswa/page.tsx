"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MahasiswaForm from "@/components/MahasiswaForm";
import MahasiswaTable from "@/components/MahasiswaTable";
import { getToken, getUser, logout } from "@/lib/auth";
import {
  createMahasiswa,
  deleteMahasiswa,
  getMahasiswa,
  getProdi,
  Mahasiswa,
  Prodi,
  updateMahasiswa,
} from "@/lib/api";

export default function MahasiswaPage() {
  const [user, setUser] = useState<any>(null);
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Search, Filter, & Pagination state
  const [search, setSearch] = useState("");
  const [prodiId, setProdiId] = useState("");
  const [prodis, setProdis] = useState<Prodi[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Auth Check
  useEffect(() => {
    const token = getToken();
    const currentUser = getUser();
    if (!token) {
      window.location.href = "/login";
    } else {
      setUser(currentUser);
    }
  }, []);

  // Fetch list of prodi for the filter dropdown
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const fetchProdis = async () => {
      try {
        const data = await getProdi();
        setProdis(data);
      } catch (err) {
        console.error("Gagal mengambil data prodi:", err);
      }
    };
    fetchProdis();
  }, []);

  const loadMahasiswa = async () => {
    const token = getToken();
    if (!token) return;

    try {
      setLoading(true);
      setError("");
      const result = await getMahasiswa({
        search,
        prodi_id: prodiId,
        page,
        limit,
      });

      setMahasiswa(result.data);
      setTotal(result.meta.total);
      setTotalPage(result.meta.totalPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil data mahasiswa");
    } finally {
      setLoading(false);
    }
  };

  // Trigger reload when page changes
  useEffect(() => {
    const token = getToken();
    if (token) {
      loadMahasiswa();
    }
  }, [page]);

  // Trigger reload and reset to page 1 when prodi filter changes
  useEffect(() => {
    const token = getToken();
    if (token) {
      setPage(1);
      loadMahasiswa();
    }
  }, [prodiId]);

  const handleSearch = () => {
    const token = getToken();
    if (!token) return;
    setPage(1);
    loadMahasiswa();
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setMessage("");
      setError("");

      if (selectedMahasiswa) {
        await updateMahasiswa(selectedMahasiswa.id, formData);
        setMessage("Data mahasiswa berhasil diperbarui");
      } else {
        await createMahasiswa(formData);
        setMessage("Data mahasiswa berhasil ditambahkan");
      }

      setSelectedMahasiswa(null);
      setPage(1);
      await loadMahasiswa();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Yakin ingin menghapus data ini?");
    if (!confirmed) return;

    try {
      setMessage("");
      setError("");
      await deleteMahasiswa(id);
      setMessage("Data mahasiswa berhasil dihapus");
      await loadMahasiswa();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data");
    }
  };

  // Statistics calculation
  const latestAngkatan = mahasiswa.length > 0
    ? Math.max(...mahasiswa.map((m) => m.angkatan))
    : "-";

  return (
    <main className="container animate-fade-in">
      {/* Dashboard Top Header */}
      <div className="header">
        <div>
          <h1>Panel Akademik Mahasiswa</h1>
          <p style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <span className="badge badge-success">
              <span style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "currentColor",
                marginRight: 2
              }}></span>
              Connected to API &amp; MySQL
            </span>
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {user && (
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Halo, <strong>{user.name}</strong> ({user.role})
            </span>
          )}

          <button className="btn-danger" onClick={logout} style={{ padding: "8px 16px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>

          <Link href="/">
            <button className="btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Kembali Beranda
            </button>
          </Link>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {message && (
        <div className="message success">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          {message}
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

      {/* Stats Cards Row */}
      <div className="grid-3">
        <div className="card stat-card card-accent-primary">
          <div className="stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="stat-info">
            <div className="stat-value">{loading && total === 0 ? "..." : total}</div>
            <div className="stat-label">Total Mahasiswa</div>
          </div>
        </div>

        <div className="card stat-card card-accent-accent">
          <div className="stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
            </svg>
          </div>
          <div className="stat-info">
            <div className="stat-value">{prodis.length}</div>
            <div className="stat-label">Program Studi</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--success)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div className="stat-info">
            <div className="stat-value">{loading && mahasiswa.length === 0 ? "..." : latestAngkatan}</div>
            <div className="stat-label">Angkatan Terbaru</div>
          </div>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid">
        {/* Left Side: Form Container */}
        <div>
          <MahasiswaForm
            selectedMahasiswa={selectedMahasiswa}
            onSubmit={handleSubmit}
            onCancelEdit={() => setSelectedMahasiswa(null)}
          />
        </div>

        {/* Right Side: Table Container with Filters */}
        <div className="card">
          <h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
              <line x1="15" y1="3" x2="15" y2="21"></line>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="3" y1="15" x2="21" y2="15"></line>
            </svg>
            Daftar Mahasiswa ({total})
          </h2>

          {/* Live Search and Filter Bar */}
          <div className="search-filter-bar" style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <div className="search-input-wrapper" style={{ flex: 1, display: "flex", alignItems: "center", position: "relative" }}>
              <span className="search-icon" style={{ position: "absolute", left: 12 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Cari NIM atau nama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                style={{ width: "100%", padding: "10px 12px 10px 38px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-primary)" }}
              />
            </div>

            <select
              style={{ minWidth: 160, padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-primary)" }}
              value={prodiId}
              onChange={(e) => setProdiId(e.target.value)}
            >
              <option value="">Semua Prodi</option>
              {prodis.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama_prodi}
                </option>
              ))}
            </select>

            <button className="btn-primary" onClick={handleSearch} style={{ padding: "8px 16px" }}>
              Cari
            </button>
          </div>

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
              <p style={{ fontSize: "0.875rem" }}>Memuat data dari database...</p>
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : (
            <>
              <MahasiswaTable
                mahasiswa={mahasiswa}
                onEdit={setSelectedMahasiswa}
                onDelete={handleDelete}
              />

              {/* Pagination Controls */}
              <div className="pagination-bar" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginTop: 24, borderTop: "1px solid var(--border-color)", paddingTop: 16 }}>
                <button
                  className="btn-secondary"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  style={{ padding: "6px 12px", fontSize: "0.875rem" }}
                >
                  Previous
                </button>

                <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>
                  Halaman {page} dari {totalPage || 1}
                </span>

                <button
                  className="btn-secondary"
                  disabled={page >= totalPage}
                  onClick={() => setPage(page + 1)}
                  style={{ padding: "6px 12px", fontSize: "0.875rem" }}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
