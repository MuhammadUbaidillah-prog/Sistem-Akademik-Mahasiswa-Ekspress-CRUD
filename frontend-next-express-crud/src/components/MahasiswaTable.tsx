"use client";

import { Mahasiswa } from "@/lib/api";

type Props = {
  mahasiswa: Mahasiswa[];
  onEdit: (item: Mahasiswa) => void;
  onDelete: (id: number) => Promise<void>;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export default function MahasiswaTable({ mahasiswa, onEdit, onDelete }: Props) {
  if (mahasiswa.length === 0) {
    return (
      <div style={{
        padding: "48px 24px",
        textAlign: "center",
        color: "var(--text-secondary)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        border: "1px dashed var(--border-color)",
        borderRadius: "var(--radius-md)"
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <p style={{ fontWeight: 500 }}>Tidak ada data mahasiswa ditemukan.</p>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
          Coba ubah kata kunci pencarian Anda atau tambahkan mahasiswa baru.
        </p>
      </div>
    );
  }

  // Get color gradient for student avatar based on name length/hash
  const getAvatarGradient = (name: string) => {
    const code = name.charCodeAt(0) % 5;
    const gradients = [
      "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", // Indigo Purple
      "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)", // Blue Cyan
      "linear-gradient(135deg, #10b981 0%, #059669 100%)", // Emerald Green
      "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", // Amber Orange
      "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)"  // Pink Rose
    ];
    return gradients[code];
  };

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th style={{ width: "60px", textAlign: "center" }}>No</th>
            <th>Mahasiswa</th>
            <th>NIM</th>
            <th>Program Studi</th>
            <th>Angkatan</th>
            <th style={{ width: "120px", textAlign: "right" }}>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {mahasiswa.map((item, index) => {
            const initial = item.nama ? item.nama.charAt(0).toUpperCase() : "?";
            const avatarBg = getAvatarGradient(item.nama || "");

            return (
              <tr key={item.id}>
                <td style={{ textAlign: "center", fontWeight: 600, color: "var(--text-muted)" }}>
                  {index + 1}
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {item.foto ? (
                      <img
                        src={`${BACKEND_URL}/uploads/mahasiswa/${item.foto}`}
                        alt={item.nama}
                        width={40}
                        height={40}
                        style={{ borderRadius: "50%", objectFit: "cover", width: 40, height: 40 }}
                      />
                    ) : (
                      <div className="avatar" style={{ background: avatarBg }}>
                        {initial}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        {item.nama}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        ID: #{item.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", fontWeight: 500 }}>
                  {item.nim}
                </td>
                <td>
                  <span className="badge badge-primary">
                    {item.nama_prodi}
                  </span>
                </td>
                <td>
                  <span className="badge badge-info" style={{ background: "rgba(59, 130, 246, 0.08)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                    {item.angkatan}
                  </span>
                </td>
                <td>
                  <div className="actions" style={{ justifyContent: "flex-end" }}>
                    <button 
                      className="btn-secondary" 
                      style={{ padding: 8 }}
                      onClick={() => onEdit(item)}
                      title="Edit Data"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                      </svg>
                    </button>

                    <button 
                      className="btn-danger" 
                      style={{ padding: 8 }}
                      onClick={() => onDelete(item.id)}
                      title="Hapus Data"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
