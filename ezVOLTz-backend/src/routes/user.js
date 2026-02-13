import express from 'express';
import multer from 'multer';
import {
  deleteUserOwnProfile,
  getUserOwnProfile,
  sendOTP,
  updateFirebaseToken,
  uploadProfileUserImage,
  userPasswordUpdate,
  userProfileUpdate,
  userToggleEmailSubscription,
  verifyOTP,
} from '../controllers/user/userController.js';
import { checkUserVerified } from '../controllers/auth/authController.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get('/profile', getUserOwnProfile);
router.patch('/profile/:userId', userProfileUpdate);
router.patch('/profile/consent/:userId', userToggleEmailSubscription);
router.patch('/profile-password/:userId', userPasswordUpdate);
router.post(
  '/profile-image/:userId',
  upload.single('image'),
  uploadProfileUserImage
);
router.delete('/profile/delete/:userId', deleteUserOwnProfile);
router.post('/sms-verification/:userId', sendOTP);
router.post('/sms-verification-code/:userId', verifyOTP);
router.post('/is-verified', checkUserVerified);
router.post('/update-firebase-token', updateFirebaseToken);

export default router;
