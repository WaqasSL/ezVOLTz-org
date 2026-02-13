import express from 'express';
import multer from 'multer';
import {
  addUser,
  adminGetUserProfile,
  adminUpdateUserProfile,
  adminUploadUserImage,
  deleteUser,
  getAllUsers,
  getAllUsersForCSV,
} from '../../controllers/admin/adminUser/adminUserController.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get('/all', getAllUsers);
router.get('/all-csv', getAllUsersForCSV);
router.get('/profile/:userId', adminGetUserProfile);
router.put('/profile-update/:userId', adminUpdateUserProfile);
router.put(
  '/profile-image/:userId',
  upload.single('image'),
  adminUploadUserImage
);
router.post('/add', addUser);
router.delete('/delete/:userId', deleteUser);

export default router;
