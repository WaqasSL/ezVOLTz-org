import express from 'express';
import { getAllTrips,getTripDetail, getAllUserTrips } from '../../controllers/admin/adminTrip/adminTrip.js';

const router = express.Router();

router.get('/all', getAllTrips);
router.get('/detail/:tripId', getTripDetail);
router.get('/user/:userId', getAllUserTrips);

export default router;
