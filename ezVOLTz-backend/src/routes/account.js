import express from 'express';
import {
  getCustomerPaymentMethodDetail,
  setupPaymentForLater,
  getUserAccount,
  addPaymentAccount,
  getCustomerDetail,
  getCustomerPaymentMethods,
  deleteCustomerPaymentMethod,
  deleteCustomer,
} from '../controllers/account/accountController.js';

const router = express.Router();

router.get('/create/:userId', setupPaymentForLater);
router.post('/payment', addPaymentAccount);
router.get('/:userId', getUserAccount);
router.get('/customer/:userId', getCustomerDetail);
router.get('/payment-methods/:userId', getCustomerPaymentMethods);
router.get(
  '/payment-method-detail/:userId/:paymentId',
  getCustomerPaymentMethodDetail
);
router.delete('/customer/:userId', deleteCustomer);
router.delete(
  '/customer/payment/:userId/:paymentId',
  deleteCustomerPaymentMethod
);

export default router;
