import express from 'express';
import {
  updateTransactionLogsWebhook,
  cancelChargingWebhook,
  createTransactionLogsWebhook,
  getTransactionLogByUser,
  getTransactionLogByUserAndCharger,
  updateChargerStatusWebhook,
} from '../controllers/transactionLogs/transactionLogsController.js';
import { authorizeSaasCharge } from '../middleware/saaschargeMiddleware.js';
import { authorizationUser } from '../middleware/authMiddleware.js';
import { apiLogger } from '../middleware/saaschargeLogger.js'; // Import logger

const router = express.Router();

// Apply apiLogger middleware to log request and response for every route
router.post(
  '/update-status',
  authorizeSaasCharge,
  apiLogger,
  updateChargerStatusWebhook
);
router.post(
  '/transaction-started',
  authorizeSaasCharge,
  apiLogger,
  createTransactionLogsWebhook
);
router.post(
  '/transaction-log',
  authorizeSaasCharge,
  apiLogger,
  updateTransactionLogsWebhook
);
router.post(
  '/transaction-cancelled',
  authorizeSaasCharge,
  apiLogger,
  cancelChargingWebhook
);
router.get(
  '/transaction-log/user/:userId',
  authorizationUser,
  apiLogger,
  getTransactionLogByUser
);
router.get(
  '/transaction-log/:userId/:chargerId',
  authorizationUser,
  apiLogger,
  getTransactionLogByUserAndCharger
);

export default router;
