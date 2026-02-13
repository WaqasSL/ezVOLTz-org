import express from 'express';
import {
  addDriver,
  addDriverSubscription,
} from '../controllers/saasCharge/saasChargeController.js';

const router = express.Router();

router.get('/driver/:userId', addDriver);
router.get('/driver-subscription/:userId/:driverId', addDriverSubscription);

export default router;
