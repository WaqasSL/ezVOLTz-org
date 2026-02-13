import express from 'express';
import multer from 'multer';
import {
  addVehicle,
  deleteVehicle,
  getAllVehicleByUser,
  getSingleVehicleByUser,
  updateVehicle,
} from '../controllers/vehicle/vehicleController.js';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
});

const router = express.Router();

router.post('', upload.single('image'), addVehicle);
router.get('/:userId', getAllVehicleByUser);
router.get('/:userId/:vehicleId', getSingleVehicleByUser);
router.patch('/:userId/:vehicleId', upload.single('image'), updateVehicle);
router.delete('/:userId/:vehicleId', deleteVehicle);

export default router;
