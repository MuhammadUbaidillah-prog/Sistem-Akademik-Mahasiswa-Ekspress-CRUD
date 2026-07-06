# Laporan Hasil Uji Endpoint & Otorisasi Role (Materi 14)

Laporan ini menyajikan hasil uji coba otorisasi hak akses (Role Authorization) untuk masing-masing role: **Admin**, **Operator**, dan **Viewer** pada Sistem Akademik Mahasiswa.

## 1. Akun Uji Coba (Seed Data)
Berikut adalah daftar akun yang terdaftar dalam database untuk pengujian:

| Nama Pengguna | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Admin Uji** | `admin@kampus.ac.id` | `password123` | `admin` |
| **Operator Uji** | `operator@kampus.ac.id` | `password123` | `operator` |
| **Viewer Uji** | `viewer@kampus.ac.id` | `password123` | `viewer` |

---

## 2. Matriks Hak Akses Endpoint (Backend)

Pengujian dilakukan menggunakan REST Client dengan menyertakan token JWT pada Header `Authorization: Bearer <token>` untuk masing-masing role.

| Method | Endpoint | Fungsi | Admin | Operator | Viewer | Hasil Uji |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: |
| **GET** | `/api/mahasiswa` | Mendapatkan daftar & pencarian mahasiswa | ✅ | ✅ | ✅ | **Berhasil** |
| **POST** | `/api/mahasiswa` | Menambahkan data mahasiswa baru | ✅ | ✅ | ❌ | **Berhasil** |
| **PUT** | `/api/mahasiswa/:id` | Memperbarui data mahasiswa | ✅ | ✅ | ❌ | **Berhasil** |
| **DELETE** | `/api/mahasiswa/:id` | Menghapus data mahasiswa | ✅ | ❌ | ❌ | **Berhasil** |

### Detail Respons Penolakan Akses (HTTP 403 Forbidden)
Jika role yang tidak berwenang mencoba mengakses endpoint tertentu (misalnya, `viewer` melakukan POST atau `operator` melakukan DELETE), backend mengembalikan respons JSON:
```json
{
  "message": "Anda tidak memiliki akses ke fitur ini"
}
```

---

## 3. Hasil Pengujian Tampilan Antarmuka (Frontend Next.js)

Tampilan antarmuka dinamis akan menyesuaikan tombol aksi berdasarkan role user yang sedang masuk:

### A. Tampilan untuk Role: `admin`
* **Form Input Tambah/Edit**: Ditampilkan secara penuh di sisi kiri halaman.
* **Tabel Mahasiswa**: Tombol **Edit** (ikon pensil) dan tombol **Hapus** (ikon tempat sampah merah) ditampilkan secara utuh.
* **Aksi**: Memiliki kontrol penuh atas semua operasi CRUD.

### B. Tampilan untuk Role: `operator`
* **Form Input Tambah/Edit**: Ditampilkan secara penuh di sisi kiri halaman.
* **Tabel Mahasiswa**: Tombol **Edit** ditampilkan, tetapi tombol **Hapus** disembunyikan untuk mencegah penghapusan data secara tidak sengaja.
* **Aksi**: Dapat menambah dan mengubah data mahasiswa, namun tidak dapat menghapusnya.

### C. Tampilan untuk Role: `viewer`
* **Form Input Tambah/Edit**: Disembunyikan sepenuhnya dari layar, dan panel daftar tabel mahasiswa melebar memenuhi layar secara adaptif (tampilan 1-kolom penuh).
* **Tabel Mahasiswa**: Tombol **Edit** dan **Hapus** disembunyikan sepenuhnya dari kolom aksi.
* **Aksi**: Hanya dapat membaca data, menggunakan fitur pencarian, filter prodi, dan navigasi halaman (pagination).
