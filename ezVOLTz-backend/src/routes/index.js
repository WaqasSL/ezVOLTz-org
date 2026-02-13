import express from 'express';
import {
  registerUser,
  loginUser,
  verifyUser,
  resendVerifyEmail,
  generaterefreshToken,
  setNewPassword,
  forgotPassword,
  socialAccountLogin,
  checkUserAndLoggedIsSame,
} from '../controllers/auth/authController.js';
import sgMail from '@sendgrid/mail';
import vehicle from './vehicle.js';
import vehicleManufacture from './vehicleManufacture.js';
import user from './user.js';
import trip from './trip.js';
import charger from './charger.js';
import account from './account.js';
import saasCharge from './saasCharge.js';
import review from './review.js';
import reply from './reply.js';
import feedback from './feedback.js';
import apple from './apple.js';
import notifications from './notifications.js';
import transactionLogs from './transactionLogs.js';
import stats from './stats.js';
import { authorizationUser } from '../middleware/authMiddleware.js';
import { errorMessage } from '../config/config.js';
import adminRoutes from './admin/adminIndex.js';
import { getAllActiveAds } from '../controllers/admin/adminAds/adminAdsController.js';

const router = express.Router();

//Api's
router.use('/admin', adminRoutes);

// Check if server is in staging environment
const isStaging = process.env.ENVIRONMENT === 'staging';

// Routes that should only be available in staging environment
if (isStaging) {
  router.get('/ads', getAllActiveAds);
  router.use('/notifications', authorizationUser, notifications);
  router.use('/charger', authorizationUser, charger);
  router.use('/saascharge', authorizationUser, saasCharge);
  router.use('/stats', stats);
  router.use('/charging', transactionLogs);
} else {
  // In production or other environments, these routes won't be available
}

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/social-login', socialAccountLogin);
router.get('/verify/:token', verifyUser);
router.post('/resend-verify', resendVerifyEmail);
router.get('/refresh-token/:refreshToken', generaterefreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/check-email/:token', checkUserAndLoggedIsSame);
router.post('/set-password/:token', setNewPassword);
router.post('/contact', (req, res) => {
  const { email, message, name, subject } = req.body;
  try {
    const msg = {
      from: process.env.SENDGRID_ACCOUNT_EMAIL,
      template_id: process.env.SENDGRID_TEM_ID_FOR_CONTACT,
      personalizations: [
        {
          to: { email: 'info@ezvoltz.com' },
          dynamic_template_data: {
            subject: 'How can we help!',
            user_email: email,
            user_message: message,
            user_name: name,
            user_subject: subject,
          },
        },
      ],
    };
    sgMail
      .send(msg)
      .then(() => {
        res.status(200).send({
          message:
            'Your message has been received. ezVOLTz will contact you soon.',
        });
      })
      .catch((error) => {
        res.status(401).send({ error: error });
      });
  } catch (error) {
    errorMessage(res, error);
  }
});

// Routes that are always available regardless of environment
router.use('/vehicle', authorizationUser, vehicle);
router.use('/vehicle-manufacture', vehicleManufacture);
router.use('/user', authorizationUser, user);
router.use('/trip', authorizationUser, trip);
router.use('/account', authorizationUser, account);
router.use('/review', review);
router.use('/reviews/reply', reply);
router.use('/feedback', feedback);
router.use('/apple', apple);

export default router;
