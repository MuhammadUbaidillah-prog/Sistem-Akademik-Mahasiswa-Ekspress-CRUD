import { Router } from 'express';
import {
  getAllMahasiswa,
  createMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from '../controllers/mahasiswa.controller';
import { uploadFotoMahasiswa } from '../middlewares/upload.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Lindungi semua route di bawah ini menggunakan authMiddleware
router.use(authMiddleware);

router.get('/', getAllMahasiswa);
router.post('/', uploadFotoMahasiswa.single('foto'), createMahasiswa);
router.put('/:id', uploadFotoMahasiswa.single('foto'), updateMahasiswa);
router.delete('/:id', deleteMahasiswa);

export default router;
