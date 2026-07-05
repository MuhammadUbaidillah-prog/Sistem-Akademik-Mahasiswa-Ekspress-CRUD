import { getToken } from "./auth";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export type Mahasiswa = {
  id: number;
  nim: string;
  nama: string;
  prodi_id: number;
  nama_prodi: string;
  angkatan: number;
  foto?: string | null;
  created_at?: string;
};

export type Prodi = {
  id: number;
  nama_prodi: string;
};

export type PaginatedResponse<T> = {
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: T[];
};

export async function getMahasiswa(params: {
  search?: string;
  prodi_id?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Mahasiswa>> {
  const query = new URLSearchParams();

  if (params.search) query.set("search", params.search);
  if (params.prodi_id) query.set("prodi_id", params.prodi_id);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const token = getToken();
  const response = await fetch(`${API_URL}/mahasiswa?${query.toString()}`, {
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const result = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    throw new Error(result.message || "Gagal mengambil data mahasiswa");
  }
  return result;
}

export async function getProdi(): Promise<Prodi[]> {
  const response = await fetch(`${API_URL}/prodi`, {
    cache: "no-store",
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal mengambil data prodi");
  }
  return result.data || [];
}

export async function createMahasiswa(formData: FormData): Promise<any> {
  const token = getToken();
  const response = await fetch(`${API_URL}/mahasiswa`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData, // Mengirimkan FormData secara langsung agar browser mengatur header multipart/form-data
  });

  const result = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    throw new Error(result.message || "Gagal menambahkan mahasiswa");
  }
  return result;
}

export async function updateMahasiswa(
  id: number,
  formData: FormData
): Promise<any> {
  const token = getToken();
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "PUT",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    throw new Error(result.message || "Gagal memperbarui data mahasiswa");
  }
  return result;
}

export async function deleteMahasiswa(id: number): Promise<void> {
  const token = getToken();
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const result = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    throw new Error(result.message || "Gagal menghapus data mahasiswa");
  }
}

