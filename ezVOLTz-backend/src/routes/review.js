import express from 'express';
import multer from 'multer';
import {
  addReview,
  deleteReview,
  deleteReviewImages,
  getAllReviewsByStation,
  getReviewsById,
  likeOrDislikeReview,
  updateReview,
  uploadReviewImages,
} from '../controllers/review/reviewController.js';
import { authorizationUser } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { files: 5 },
});

export const uploadImages = upload.array('images', 5);

router.get('/all/:stationId/:stationType', getAllReviewsByStation);
router.post('/', authorizationUser, addReview);
router.patch('/', authorizationUser, updateReview);
router.post('/image', authorizationUser, uploadReviewImages);
router.get('/:userId/:reviewId', authorizationUser, getReviewsById);
router.post('/like-dislike', authorizationUser, likeOrDislikeReview);
router.delete('/:userId/:reviewId', authorizationUser, deleteReview);
router.delete(
  '/:userId/:reviewId/:imageId',
  authorizationUser,
  deleteReviewImages
);

export default router;
