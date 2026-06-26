import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container hero-wrapper animate-fade-in">
      <div className="card hero-card card-accent-primary">
        <div className="hero-badge">Express &amp; Next.js Integration</div>
        
        {/* Decorative central database icon */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "var(--primary-gradient)",
          display: "flex",
          alignItems: "center",
          justify: "center",
          boxShadow: "var(--shadow-glow)",
          color: "white",
          fontSize: "2rem",
          justifyContent: "center",
          marginBottom: 8
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
            <path d="M3 12A9 3 0 0 0 21 12"></path>
          </svg>
        </div>

        <h1 className="hero-title">Sistem Akademik Mahasiswa</h1>
        <p className="hero-subtitle">
          Platform manajemen data mahasiswa modern yang cepat, responsif, dan terintegrasi secara seamless dengan Express.js API &amp; MySQL.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <Link href="/mahasiswa">
            <button className="btn-primary" style={{ padding: "12px 24px", fontSize: "0.95rem" }}>
              Kelola Data Mahasiswa
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
