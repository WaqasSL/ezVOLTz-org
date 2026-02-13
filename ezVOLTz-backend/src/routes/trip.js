import express from 'express';
import {
  addTrip,
  deleteTripById,
  getAllInProgressTripByUser,
  getAllPreviousTripByUser,
  getAllUpcomingTripByUser,
  getSingleTripById,
  getAllTripByUser,
  startTripById,
  stopTripById,
  updateTripById,
} from '../controllers/trip/tripController.js';

const router = express.Router();

router.get('/:userId', getAllTripByUser);
router.get('/previous/:userId', getAllPreviousTripByUser);
router.get('/upcoming/:userId', getAllUpcomingTripByUser);
router.get('/status/:userId', getAllInProgressTripByUser);
router.get('/:userId/:tripId', getSingleTripById);
router.post('/:userId', addTrip);
router.patch('/:userId/:tripId', updateTripById);
router.post('/start/:userId/:tripId', startTripById);
router.get('/stop/:userId/:tripId', stopTripById);
router.delete('/:userId/:tripId', deleteTripById);

export default router;
