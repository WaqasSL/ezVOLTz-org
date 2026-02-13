import express from 'express';
import {
  createStat,
  getStats,
  updateStat,
} from '../controllers/stats/statsController.js';

const router = express.Router();

router.get('/all', getStats);
router.post('/create', createStat);
router.put('/update/:id', updateStat);

export default router;
