"use client";

import { FormEvent, useEffect, useState } from "react";
import { Mahasiswa, Prodi, getProdi } from "@/lib/api";

type Props = {
  selectedMahasiswa: Mahasiswa | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancelEdit: () => void;
};

export default function MahasiswaForm({
  selectedMahasiswa,
  onSubmit,
  onCancelEdit,
}: Props) {
  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [prodiId, setProdiId] = useState("");
  const [angkatan, setAngkatan] = useState(new Date().getFullYear());
  const [foto, setFoto] = useState<File | null>(null);

  const [prodis, setProdis] = useState<Prodi[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch list of prodi for dropdown selection
  useEffect(() => {
    const fetchProdis = async () => {
      try {
        const data = await getProdi();
        setProdis(data);
      } catch (error) {
        console.error("Gagal memuat prodi:", error);
      }
    };
    fetchProdis();
  }, []);

  useEffect(() => {
    if (selectedMahasiswa) {
      setNim(selectedMahasiswa.nim);
      setNama(selectedMahasiswa.nama);
      setProdiId(String(selectedMahasiswa.prodi_id));
      setAngkatan(selectedMahasiswa.angkatan);
      setFoto(null);
    } else {
      setNim("");
      setNama("");
      setProdiId("");
      setAngkatan(new Date().getFullYear());
      setFoto(null);
    }
  }, [selectedMahasiswa]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("nim", nim);
      formData.append("nama", nama);
      formData.append("prodi_id", prodiId);
      formData.append("angkatan", String(angkatan));
      if (foto) {
        formData.append("foto", foto);
      }

      await onSubmit(formData);

      // Clear input fields only on creation mode success
      if (!selectedMahasiswa) {
        setNim("");
        setNama("");
        setProdiId("");
        setAngkatan(new Date().getFullYear());
        setFoto(null);
        const fileInput = document.getElementById("foto") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card card-accent-primary animate-fade-in">
      <h2>
        {selectedMahasiswa ? (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Mahasiswa
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            Tambah Mahasiswa
          </>
        )}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 20 }}>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
          {selectedMahasiswa 
            ? "Ubah data kolom di bawah ini dan klik Update untuk menyimpan perubahan." 
            : "Lengkapi semua field untuk mendaftarkan mahasiswa baru."}
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="nim">Nomor Induk Mahasiswa (NIM)</label>
        <input
          id="nim"
          type="text"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          placeholder="Contoh: 2201001"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="nama">Nama Lengkap</label>
        <input
          id="nama"
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Masukkan nama lengkap mahasiswa"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="prodi_id">Program Studi</label>
        <select
          id="prodi_id"
          value={prodiId}
          onChange={(e) => setProdiId(e.target.value)}
          required
          style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-primary)" }}
        >
          <option value="">Pilih Program Studi</option>
          {prodis.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nama_prodi}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="angkatan">Tahun Angkatan</label>
        <input
          id="angkatan"
          type="number"
          value={angkatan}
          onChange={(e) => setAngkatan(Number(e.target.value))}
          placeholder="Contoh: 2022"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="foto">Foto Mahasiswa</label>
        <input
          id="foto"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFoto(e.target.files[0]);
            }
          }}
          style={{ width: "100%", padding: "6px 8px" }}
        />
        {selectedMahasiswa && selectedMahasiswa.foto && (
          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 4 }}>
            Foto saat ini: <code>{selectedMahasiswa.foto}</code> (kosongkan jika tidak ingin diubah)
          </p>
        )}
      </div>

      <div className="actions" style={{ borderTop: "1px solid var(--border-color)", paddingTop: 16, marginTop: 24 }}>
        <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
          {loading ? (
            <>
              <span className="spinner" style={{
                display: "inline-block",
                width: 14,
                height: 14,
                border: "2px solid rgba(255, 255, 255, 0.3)",
                borderTopColor: "white",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite"
              }}></span>
              Menyimpan...
            </>
          ) : selectedMahasiswa ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Update Data
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Simpan Data
            </>
          )}
        </button>

        {selectedMahasiswa && (
          <button type="button" className="btn-secondary" onClick={onCancelEdit}>
            Batal
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
