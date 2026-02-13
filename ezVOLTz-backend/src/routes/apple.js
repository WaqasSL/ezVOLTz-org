import express from 'express';
import {
  appleRevokeAccount,
  appleSignIn,
} from '../controllers/apple/appleController.js';

const router = express.Router();

router.post('/apple-signin', appleSignIn);
router.post('/revoke-token', appleRevokeAccount);

export default router;
