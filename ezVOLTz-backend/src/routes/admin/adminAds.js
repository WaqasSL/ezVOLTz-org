import express from 'express';
import multer from 'multer';
import {
  deleteAd,
  editAd,
  getAdById,
  getAllAds,
  publishAd,
  toggleAdStatus,
} from '../../controllers/admin/adminAds/adminAdsController.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { files: 6 },
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/gif'
    ) {
      const fileSize = parseInt(req.headers['content-length']);

      if (fileSize > 31457280) {
        return callback(
          new Error({
            message: 'File size too large. Max size should be 10mb',
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

export const uploadAdsImages = upload.array('images', 6);

router.get('/all', getAllAds);
router.get('/one/:adId', getAdById);
router.post('/publish', publishAd);
router.post('/toggle-status/:adId', toggleAdStatus);
router.put('/edit/:adId', editAd);
router.delete('/delete/:adId', deleteAd);

export default router;
