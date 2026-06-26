"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MahasiswaForm from "@/components/MahasiswaForm";
import MahasiswaTable from "@/components/MahasiswaTable";
import {
  createMahasiswa,
  deleteMahasiswa,
  getMahasiswa,
  Mahasiswa,
  MahasiswaInput,
  updateMahasiswa,
} from "@/lib/api";

export default function MahasiswaPage() {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAngkatan, setFilterAngkatan] = useState("");

  const loadMahasiswa = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMahasiswa();
      setMahasiswa(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil data mahasiswa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMahasiswa();
  }, []);

  const handleSubmit = async (payload: MahasiswaInput) => {
    try {
      setMessage("");
      setError("");

      if (selectedMahasiswa) {
        await updateMahasiswa(selectedMahasiswa.id, payload);
        setMessage("Data mahasiswa berhasil diperbarui");
      } else {
        await createMahasiswa(payload);
        setMessage("Data mahasiswa berhasil ditambahkan");
      }

      setSelectedMahasiswa(null);
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
  const totalMahasiswa = mahasiswa.length;
  const uniqueProdis = new Set(mahasiswa.map((m) => m.prodi.trim().toLowerCase())).size;
  const latestAngkatan = mahasiswa.length > 0 
    ? Math.max(...mahasiswa.map((m) => m.angkatan)) 
    : "-";

  // Filtered lists
  const filteredMahasiswa = mahasiswa.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prodi.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAngkatan =
      filterAngkatan === "" || item.angkatan.toString() === filterAngkatan;

    return matchesSearch && matchesAngkatan;
  });

  // Extract unique batches for the filter dropdown
  const listAngkatan = Array.from(new Set(mahasiswa.map((m) => m.angkatan))).sort((a, b) => b - a);

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
            <div className="stat-value">{loading ? "..." : totalMahasiswa}</div>
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
            <div className="stat-value">{loading ? "..." : uniqueProdis}</div>
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
            <div className="stat-value">{loading ? "..." : latestAngkatan}</div>
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
            Daftar Mahasiswa ({filteredMahasiswa.length})
          </h2>

          {/* Live Search and Filter Bar */}
          <div className="search-filter-bar">
            <div className="search-input-wrapper">
              <span className="search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Cari nama, NIM, atau prodi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              style={{ minWidth: 140 }}
              value={filterAngkatan}
              onChange={(e) => setFilterAngkatan(e.target.value)}
            >
              <option value="">Semua Angkatan</option>
              {listAngkatan.map((batch) => (
                <option key={batch} value={batch.toString()}>
                  Angkatan {batch}
                </option>
              ))}
            </select>
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
            <MahasiswaTable
              mahasiswa={filteredMahasiswa}
              onEdit={setSelectedMahasiswa}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </main>
  );
}
