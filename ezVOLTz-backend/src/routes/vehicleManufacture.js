import express from 'express';
import {
  getVehicleManufacture,
  addVehicleManufacture,
  updateVehicleModelsFromJson,
  cleanupVehicleModels,
} from '../controllers/vehicle/vehicleManufactureController.js';
import { authorizationUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('', authorizationUser, getVehicleManufacture);
router.post('', addVehicleManufacture);
router.post('/json', updateVehicleModelsFromJson);
router.delete('', cleanupVehicleModels);

export default router;
