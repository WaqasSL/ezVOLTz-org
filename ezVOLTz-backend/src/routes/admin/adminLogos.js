import express from 'express';
import multer from 'multer';
import {
  changeLogo,
  getAllLogos,
} from '../../controllers/admin/adminLogos/adminLogosController.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get('/all', getAllLogos);
router.post('/change', upload.single('image'), changeLogo);

export default router;
