CREATE DATABASE IF NOT EXISTS kampus;

USE kampus;

-- Hapus tabel jika sudah ada (urutannya penting karena foreign key)
DROP TABLE IF EXISTS mahasiswa;
DROP TABLE IF EXISTS prodi;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'operator', 'viewer') NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE prodi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_prodi VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
CREATE TABLE mahasiswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nim VARCHAR(20) NOT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  prodi_id INT NOT NULL,
  angkatan INT NOT NULL,
  foto VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_mahasiswa_prodi
    FOREIGN KEY (prodi_id) REFERENCES prodi(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

-- Insert master data prodi
INSERT INTO prodi (nama_prodi) VALUES
('Informatika'),
('Sistem Informasi'),
('Teknik Elektro'),
('Manajemen'),
('Akuntansi');

-- Insert dummy mahasiswa
INSERT INTO mahasiswa (nim, nama, prodi_id, angkatan, foto) VALUES 
('2201001', 'Ahmad Fauzi', 1, 2022, NULL),
('2201002', 'Budi Santoso', 2, 2022, NULL);

-- Insert dummy users with different roles (password: password123)
INSERT INTO users (name, email, password, role) VALUES
('Admin Uji', 'admin@kampus.ac.id', '$2b$10$h5u8N5J99L76H17pxMxD/.JNPiFllOtl16n4CPx9f8wBDO3neywM.', 'admin'),
('Operator Uji', 'operator@kampus.ac.id', '$2b$10$h5u8N5J99L76H17pxMxD/.JNPiFllOtl16n4CPx9f8wBDO3neywM.', 'operator'),
('Viewer Uji', 'viewer@kampus.ac.id', '$2b$10$h5u8N5J99L76H17pxMxD/.JNPiFllOtl16n4CPx9f8wBDO3neywM.', 'viewer');
