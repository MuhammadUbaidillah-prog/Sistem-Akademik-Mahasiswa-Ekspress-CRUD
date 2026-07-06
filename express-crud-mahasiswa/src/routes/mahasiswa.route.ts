import { Router } from 'express';
import {
  getAllMahasiswa,
  createMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from '../controllers/mahasiswa.controller';
import { uploadFotoMahasiswa } from '../middlewares/upload.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { allowRoles } from '../middlewares/role.middleware';

const router = Router();

// Lindungi semua route di bawah ini menggunakan authMiddleware
router.use(authMiddleware);

router.get('/', allowRoles('admin', 'operator', 'viewer'), getAllMahasiswa);
router.post('/', allowRoles('admin', 'operator'), uploadFotoMahasiswa.single('foto'), createMahasiswa);
router.put('/:id', allowRoles('admin', 'operator'), uploadFotoMahasiswa.single('foto'), updateMahasiswa);
router.delete('/:id', allowRoles('admin'), deleteMahasiswa);

export default router;
