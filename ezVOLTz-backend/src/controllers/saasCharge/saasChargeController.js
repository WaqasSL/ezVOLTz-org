import { createHash, randomUUID } from 'crypto';
import { errorMessage } from '../../config/config.js';
import stripe from '../../config/stripe/stripe.js';
import Account from '../../models/Account.js';
import User from '../../models/UserModel.js';
import { saasChargeInstanceApi } from '../../utls/instance/instance.js';

const generateIdTag = async (userId) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const userIdPart = userId?.slice(-4).toUpperCase() || 'XXXX';
  const hash = createHash('md5')
    .update(userId + Date.now().toString())
    .digest('hex');
  let randomPart = '';
  for (let i = 0; i < 4; i++)
    randomPart += chars.charAt(parseInt(hash[i], 16) % chars.length);

  const idTag = `ezVOLTz-${userIdPart}${randomPart}`;

  const existingTag = await Account.findOne({ idTag });
  if (existingTag) return generateIdTag(userId);

  return idTag;
};

export const addDriver = async (req, res) => {
  const { userId } = req?.params;
  try {
    let customer;
    const userInfo = await User.findOne({ _id: userId });
    if (!userInfo) return res.status(404).send({ error: 'User not found' });

    let driverInfo;
    const accountExist = await Account.findOne({ userId });
    const driverExist = await getDriverByEmailApi({ email: userInfo?.email });

    if (driverExist?.exists) {
      const driverData = { ...driverExist.data.data };
      delete driverData['subscriptionArray'];
      driverInfo = await updateDriverApi({
        userInfo: { ...userInfo?._doc },
        driverInfo: driverData,
      });
    } else
      try {
        driverInfo = await driverApi({ userInfo: userInfo?._doc });
      } catch (err) {
        if (err.status === 400) {
          try {
            const driverData = { ...driverInfo.data.data };
            delete driverData['subscriptionArray'];
            driverInfo = await updateDriverApi({
              userInfo: userInfo?._doc,
              driverInfo: driverData,
            });
          } catch (error) {
            return res.status(error.response.status).send({
              error: error?.data?.errors[0],
            });
          }
        } else {
          return res.status(err.response.status).send({
            error: err?.data?.errors[0],
          });
        }
      }

    if (accountExist && !accountExist?._doc?.customerId) {
      customer = await stripe.customers.retrieve(
        accountExist?._doc?.customerId
      );
    } else {
      customer = await stripe.customers.create({
        name: userInfo?._doc?.name,
        email: userInfo?._doc?.email,
        description: 'My Test Customer For ezVOLTZ',
      });
    }

    let subscriptionInfo;
    if (driverExist?.data?.data?.subscriptionArray?.length > 0) {
      subscriptionInfo = driverExist?.data?.data?.subscriptionArray[0];
    } else {
      const idTag = await generateIdTag(userId);
      const result = await driverSubscriptionApi({
        driverId: driverInfo?.data?.data?.driverId,
        userInfo: userInfo?._doc,
        idTag,
      });
      if (subscriptionInfo?.data?.status === 'ERROR')
        return res
          .status(400)
          .send({ error: subscriptionInfo?.data?.errors[0] });
      subscriptionInfo = result.data?.data?.subscriptionArray[0];
    }

    if (accountExist) {
      const updatedUser = await Account.findByIdAndUpdate(
        accountExist?._doc?._id,
        {
          driverId: driverInfo?.data?.data?.driverId,
          idTag: subscriptionInfo?.idTag,
        }
      );
      if (!updatedUser)
        return res
          .status(500)
          .send({ error: 'Something went wrong please try again later.' });
    } else {
      const account = await Account.create({
        userId: userInfo?._doc?._id,
        driverId: driverInfo?.data?.data?.driverId,
        customerId: customer?.id,
        idTag: subscriptionInfo?.idTag,
      });

      if (!account)
        return res
          .status(500)
          .send({ error: 'Something went wrong please try again.' });
    }
    res.status(200).send({ message: 'Driver has been created.' });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const addDriverSubscription = async (req, res) => {
  const { driverId, userId } = req?.params;
  try {
    const userInfo = await User.findOne({ _id: userId });
    const account = await Account.findOne({ userId });
    if (!account)
      return res
        .status(404)
        .send({ error: 'Your driver account does not exist.' });
    const idTag = await generateIdTag(userId);
    const subscriptionInfo = await driverSubscriptionApi({
      driverId,
      userInfo: userInfo?._doc,
      idTag,
    });
    if (subscriptionInfo?.data?.status === 'ERROR')
      return res.status(400).send({ error: subscriptionInfo?.data?.errors[0] });
    const updated = Account.findByIdAndUpdate(account?._doc?._id, {
      idTag: subscriptionInfo?.data?.data?.subscriptionArray[0]?.idTag,
    });
    if (!updated)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again.' });
    res.status(200).send({ message: 'Driver subscription has been created.' });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const linkDriverAccount = async ({ driverId, customerId }) => {
  try {
    const result = await saasChargeInstanceApi.patch(
      `driver/payment/link/${driverId}/${customerId}`,
      {}
    );
    return result;
  } catch (error) {
    errorMessage(res, error);
  }
};

export const createDriver = async ({ userId }) => {
  try {
    let customer;
    const userInfo = await User.findOne({ _id: userId });
    const accountInfo = await Account.findOne({ userId });
    const driverInfo = await driverApi({ userInfo: userInfo?._doc });
    if (!accountInfo?._doc?.customer) {
      customer = await stripe.customers.create({
        name: userInfo?._doc?.name,
        email: userInfo?._doc?.email,
        description: 'My Test Customer For ezVOLTZ',
      });
    } else {
      customer = await stripe.customers.retrieve(accountInfo?._doc?.customerId);
    }

    const idTag = await generateIdTag(userId);
    const subscriptionInfo = await driverSubscriptionApi({
      driverId: driverInfo?.data?.data?.driverId,
      userInfo: userInfo?._doc,
      idTag,
    });

    if (accountInfo) {
      await Account.findByIdAndUpdate(accountInfo?._doc?._id, {
        driverId: driverInfo?.data?.data?.driverId,
        customerId: customer?.id,
        idTag: subscriptionInfo?.data?.data?.subscriptionArray[0]?.idTag,
      });
    } else {
      await Account.create({
        userId: userInfo?._doc?._id,
        driverId: driverInfo?.data?.data?.driverId,
        customerId: customer?.id,
        idTag: subscriptionInfo?.data?.data?.subscriptionArray[0]?.idTag,
      });
    }
  } catch (error) {}
};

export const getDriverByEmailApi = async ({ email }) => {
  return saasChargeInstanceApi
    .get(`/external/driver-by-email?email=${email}`)
    .then((response) => {
      return {
        exists: true,
        status: response?.status,
        data: response?.data,
      };
    })
    .catch((error) => {
      return {
        exists: false,
        status: error?.response?.status,
        error: error?.response?.data?.errors[0],
      };
    });
};

export const driverApi = async ({ userInfo }) =>
  await saasChargeInstanceApi.post('/external/driver', {
    uuid: `${randomUUID()}`,
    internalClientNumber: `EZVOLTZ-${userInfo?._id}`,
    targetEmpId: 'EMP-2861',
    statusType: 'ACTIVE',
    billingType: 'BILLING',
    validFromDriver: userInfo?.createdAt,
    companyName: 'ezVOLTz',
    businessType: 4,
    contactTitle: 'mr',
    contactFirstName: userInfo?.name,
    contactLastName: userInfo?.name,
    jobTitle: 'Driver',
    email: userInfo?.email,
    phone: userInfo?.phone || null,
    addCity: userInfo?.city || 'Arlington',
    addPostalCode: userInfo?.zipCode || 22202,
    addState: userInfo?.state || 'Virginia',
    addCountry: userInfo?.country || 'US',
  });

export const updateDriverApi = ({ userInfo, driverInfo }) =>
  saasChargeInstanceApi.post('/external/driver', {
    ...driverInfo,
    driverId: driverInfo?.driverId,
    internalClientNumber: `EZVOLTZ-${userInfo?._id}`,
    targetEmpId: 'EMP-2861',
    statusType: 'ACTIVE',
    billingType: 'BILLING',
    validFromDriver: userInfo?.createdAt,
    companyName: 'ezVOLTz',
    businessType: 4,
    contactTitle: 'mr',
    contactFirstName: userInfo?.name,
    contactLastName: userInfo?.name,
    jobTitle: 'Driver',
    email: userInfo?.email,
    phone: userInfo?.phone || null,
    addCity: userInfo?.city || 'Arlington',
    addPostalCode: userInfo?.zipCode || 22202,
    addState: userInfo?.state || 'Virginia',
    addCountry: userInfo?.country || 'US',
  });

export const driverSubscriptionApi = ({ driverId, userInfo, idTag }) =>
  saasChargeInstanceApi.post(`external/subscription?driverId=${driverId}`, {
    pricePlanName: 'Retail pricing 1.0',
    email: userInfo?.email,
    password: userInfo?.password || '',
    registrationType: 'rfid',
    idTag: `${idTag}`,
    validFrom: '2022-03-01',
    publicAccessRestricted: false,
    isPasswordChanged: true,
  });
