import express from 'express';
import {
  cancelCharging,
  getAllUserCharging,
  getInProgessCharging,
  getSingleUserCharging,
  startCharging,
  stopCharging,
} from '../controllers/charger/chargeController.js';

const router = express.Router();

router.post('/start-charging', startCharging);
router.post('/cancel-charging', cancelCharging);
router.post('/stop-charging', stopCharging);
router.get('/:userId', getAllUserCharging);
router.get('/in-charging/:userId', getInProgessCharging);
router.get('/:chargerId/:userId', getSingleUserCharging);

export default router;
