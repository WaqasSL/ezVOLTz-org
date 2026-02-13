import express from 'express';
import multer from 'multer';
import {
  deleteFeedback,
  getAllFeedBack,
  getSingleFeedbackByUser,
  submitFeedback,
} from '../controllers/feedback/feedbackController.js';
import { authorizationUser } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { files: 5 },
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/gif'
    ) {
      const fileSize = parseInt(req.headers['content-length']);
      if (fileSize > 10485760) {
        return callback(
          new Error({
            message: 'File size too large maximum size should be 10mb',
          })
        );
      }
      return callback(null, true);
    } else {
      return callback(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
    }
  },
  onError: function (err, next) {
    next(err);
  },
});

export const uploadFeedbackImages = upload.array('images', 5);

router.get('/', authorizationUser, getAllFeedBack);
router.post('/', submitFeedback);
router.get('/:feedbackId', authorizationUser, getSingleFeedbackByUser);
router.delete('/:feedbackId', authorizationUser, deleteFeedback);

export default router;
