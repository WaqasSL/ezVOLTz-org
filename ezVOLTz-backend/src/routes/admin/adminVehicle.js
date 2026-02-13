import express from 'express';
import {
  getAllUserVehicles,
  getAllVehicles,
} from '../../controllers/admin/adminVehicle/adminVehicleController.js';

const router = express.Router();

router.get('/all', getAllVehicles);
router.get('/:userId', getAllUserVehicles);

export default router;
