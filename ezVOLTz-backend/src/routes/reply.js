import express from 'express';
import {
  addReply,
  deleteReply,
  getAllReplyByReview,
  likeOrDislikeReply,
  updateReply,
} from '../controllers/reply/replyController.js';
import { authorizationUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/all/:reviewId', getAllReplyByReview);
router.post('/', authorizationUser, addReply);
router.patch('/', authorizationUser, updateReply);
router.post('/like-dislike', authorizationUser, likeOrDislikeReply);
router.delete('/:userId/:reviewId/:replyId', authorizationUser, deleteReply);

export default router;
