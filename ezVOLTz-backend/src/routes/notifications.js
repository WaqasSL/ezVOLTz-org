import express from 'express';
import {
  createChargingStatusNotification,
  createNotification,
  getNotifications,
  markAllAsRead,
  markOneAsRead,
} from '../controllers/notifications/notificationsController.js';
import { authorizeSaasCharge } from '../middleware/saaschargeMiddleware.js';

const router = express.Router();

router.get('/all', getNotifications);
router.post('/send', createNotification);
router.post(
  '/charging-status',
  authorizeSaasCharge,
  createChargingStatusNotification
);
router.put('/mark-all-as-read', markAllAsRead);
router.put('/mark-one-as-read/:id', markOneAsRead);

export default router;
