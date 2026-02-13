import express from 'express';
import user from './adminUser.js';
import dashboard from './adminDashboard.js';
import trip from './adminTrip.js';
import vehicle from './adminVehicle.js';
import ads from './adminAds.js';
import logos from './adminLogos.js';
import { loginAdmin } from '../../controllers/admin/adminAuth/adminAuthController.js';
import { authorizationAdmin } from '../../middleware/adminMiddleware.js';

const router = express.Router();

//Api's
router.post('/login', loginAdmin);

router.use('/user', authorizationAdmin, user);
router.use('/dashboard', authorizationAdmin, dashboard);
router.use('/trip', authorizationAdmin, trip);
router.use('/vehicle', authorizationAdmin, vehicle);
router.use('/ads', authorizationAdmin, ads);
router.use('/logos', authorizationAdmin, logos);

export default router;
