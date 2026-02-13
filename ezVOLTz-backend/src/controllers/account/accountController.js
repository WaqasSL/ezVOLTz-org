import { errorMessage } from '../../config/config.js';
import stripe from '../../config/stripe/stripe.js';
import Account from '../../models/Account.js';
import Charger from '../../models/ChargerModel.js';
import User from '../../models/UserModel.js';

export const setupPaymentForLater = async (req, res) => {
  const { userId } = req.params;
  try {
    let customer, setupIntent;
    const user = await User.findOne({ _id: userId });
    if (!user)
      return res.status(404).send({ error: 'Your account doest not exist.' });
    const account = await Account.findOne({ userId });

    if (!account) {
      customer = await stripe.customers.create({
        name: user?._doc?.name,
        email: user?._doc?.email,
        description: 'My Test Customer For ezVOLTZ',
      });
      setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        automatic_payment_methods: { enabled: true },
      });
      await Account.create({
        userId,
        customerId: customer?.id,
      });
    } else {
      customer = await stripe.customers.retrieve(account?._doc?.customerId);
      setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        automatic_payment_methods: { enabled: true },
      });
    }
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2022-11-15' }
    );

    res.status(200).send({
      setupIntentId: setupIntent.id,
      setupIntent: setupIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const addPaymentAccount = async (req, res) => {
  try {
    const accountExist = await Account.findOne({ userId: req?.body?.userId });
    if (accountExist) return res.status(200).send({ account: accountExist });
    const user = await User.findOne({ _id: req?.body?.userId });
    if (!user)
      return res.status(404).send({
        error: 'Your account is not register. Please signup first.',
      });
    const customer = await stripe.customers.create({
      name: user?._doc?.name,
      email: user?._doc?.email,
      description: 'My Test Customer For ezVOLTZ',
    });
    const account = await Account.create({
      userId: req?.body?.userId,
      customerId: customer?.id,
    });
    if (!account)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again.' });
    res.status(200).send({
      message:
        'Your strip account has been created. You can now add your payment method to your account.',
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getUserAccount = async (req, res) => {
  const { userId } = req.params;
  try {
    const account = await Account.findOne({ userId }).exec();
    if (!account)
      return res.status(404).send({ error: 'Your account is not available.' });
    res.status(200).send({ account });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getCustomerDetail = async (req, res) => {
  const { userId } = req.params;
  try {
    const account = await Account.findOne({ userId });
    if (!account)
      return res
        .status(404)
        .send({ error: 'No payment account found against your record.' });
    const customer = await stripe.customers.retrieve(account?._doc?.customerId);
    res.status(200).send({ account: { ...account?._doc, ...customer } });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getCustomerPaymentMethods = async (req, res) => {
  const { userId } = req.params;
  try {
    const account = await Account.findOne({ userId });
    if (!account)
      return res
        .status(404)
        .send({ error: 'No payment account found against your record.' });
    const paymentMethods = await stripe.customers.listPaymentMethods(
      account?._doc?.customerId
    );
    res.status(200).send({ paymentMethods });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getCustomerPaymentMethodDetail = async (req, res) => {
  const { userId, paymentId } = req.params;
  try {
    const account = await Account.findOne({ userId });
    if (!account)
      return res
        .status(404)
        .send({ error: 'No payment account found against your record.' });
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentId);
    res.status(200).send({ paymentMethod });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const deleteCustomer = async (req, res) => {
  const { userId } = req.params;
  try {
    const account = await Account.findOne({ userId });
    if (!account)
      return res
        .status(404)
        .send({ error: 'No payment account found against your record.' });
    const charging = await Charger.findOne({ userId, status: 'charging' });
    if (charging)
      return res.status(400).send({
        error:
          "You can't delete your payment account because your charging is in-process, please stop charging first.",
      });
    const isDeleted = await Account.deleteOne({ userId });
    if (isDeleted)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again.' });
    const customer = await stripe.customers.del(account?._doc?.customerId);
    if (customer?.deleted)
      res.status(200).send({ message: 'Cutomer has been deleted.' });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const deleteCustomerPaymentMethod = async (req, res) => {
  const { userId, paymentId } = req.params;
  try {
    // if (userId !== req.userInfo?.userId)
    //   return res.status(401).send({ error: 'You are not authorized.' });
    const account = await Account.findOne({ userId });
    if (!account)
      return res
        .status(404)
        .send({ error: 'No payment account found against your record.' });
    const charging = await Charger.findOne({ userId, status: 'charging' });
    if (charging)
      return res.status(400).send({
        error:
          "You can't delete the payment method because your charging is in-process, please stop charging first.",
      });
    await stripe.paymentMethods.detach(paymentId);
    res.status(200).send({ message: 'Your card has been deleted.' });
  } catch (error) {
    errorMessage(res, error);
  }
};
