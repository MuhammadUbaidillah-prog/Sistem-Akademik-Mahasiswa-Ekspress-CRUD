import { Request, Response } from "express";
import db from "../config/db";

export const getAllProdi = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.query(
      "SELECT id, nama_prodi FROM prodi ORDER BY nama_prodi ASC"
    );

    res.json({
      message: "Data prodi berhasil diambil",
      data: rows,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};
