import express from 'express';
import { getDashboardData, getLastActiveUsers, getPerformanceData } from '../../controllers/admin/adminDashboard/adminDashboardController.js';

const router = express.Router();

router.get('/data', getDashboardData);
router.get('/active-users', getLastActiveUsers);
router.get('/performance', getPerformanceData);

export default router;
