import 'dotenv/config';
import { chargerStatus, errorMessage } from '../../config/config.js';
import handleErrorException from '../../helper/helper.js';
import Account from '../../models/Account.js';
import Charger from '../../models/ChargerModel.js';
import User from '../../models/UserModel.js';
import TransactionLog from '../../models/TransactionLogModel.js';
import {
  cancelChargeSchema,
  startChargeSchema,
  stopChargeSchema,
} from '../../schema/charger/chargerSchema.js';
import { createAndSendNotification } from '../../service/notificationService/notification.js';
import {
  saasChargeInstanceApi,
  saasChargeInstanceDev,
} from '../../utls/instance/instance.js';
import stripe from '../../config/stripe/stripe.js';

export const startCharging = async (req, res) => {
  return await handleErrorException(res, async () => {
    let currentTime = new Date();
    await startChargeSchema.validate(req?.body);
    const charging = await Charger.findOne({
      userId: req?.body?.userId,
      status: { $in: [chargerStatus.preparing, chargerStatus.charging] },
    });
    if (charging)
      return res
        .status(400)
        .send({ error: 'You can start only one charging at a time.' });

    const chargerInUse = await Charger.findOne({
      chargeBoxId: req?.body?.chargeBoxId,
      connectorId: req?.body?.connectorId,
      status: { $in: [chargerStatus.preparing, chargerStatus.charging] },
    });
    if (chargerInUse)
      return res.status(400).send({ error: 'This charger is already in use.' });

    let account = await Account.findOne({ userId: req?.body?.userId });
    const user = await User.findOne({ _id: req?.body?.userId });

    await saasChargeInstanceApi
      .patch(
        `/external/driver/payment/link/${account.driverId}/${account.customerId}`,
        {}
      )
      .catch(async (error) => {
        const customer = await stripe.customers.create({
          name: user?._doc?.name,
          email: user?._doc?.email,
          description: 'My Test Customer For ezVOLTZ',
        });

        account = await Account.updateOne(
          { userId: req?.body?.userId },
          { customerId: customer.id },
          { new: true }
        );

        await saasChargeInstanceApi
          .patch(
            `/external/driver/payment/link/${account.driverId}/${account.customerId}`,
            {}
          )
          .catch((error) => {
            console.log('Link stripe customer for driver', { error });
          });
      });

    const payload = {
      idTag: req?.body?.idTag,
      chargeBoxId: req?.body?.chargeBoxId,
      connectorId: req?.body?.connectorId,
    };

    if (process.env.SAASCHARGE_DEMO_CHARGER === 'true') {
      payload.soapUrl = req?.body?.soapUrl;
    }

    const result = await saasChargeInstanceDev.post(
      '/command/external/remote-start',
      payload
    );

    if (result?.data?.status === 'ERROR' || result?.data?.status === 'BLOCKED')
      return res.status(400).send({ error: result?.data?.errors[0] });

    let isTransaction = false;

    const charger = await Charger.create({
      ...req.body,
      startTime: currentTime,
      status: chargerStatus.preparing,
    });

    const updateCharger = await Charger.findByIdAndUpdate(
      charger._id,
      {
        status: isTransaction
          ? chargerStatus.charging
          : chargerStatus.preparing,
      },
      { new: true }
    );
    if (!updateCharger)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again later.' });

    if (isTransaction) {
      await createAndSendNotification({
        userId: req?.body?.userId,
        title: 'Charging has been started',
        message: `Your vehicle charging has been started against ${
          req?.body?.chargeBoxId
        } charger at ${currentTime.toLocaleString()}.`,
        url: '/charging-activity&/ChargingActivities',
      });
    } else {
      await createAndSendNotification({
        userId: req?.body?.userId,
        title: 'Charging request has been initiated',
        message: 'Please plug the charger into the vehicle to begin charging.',
        url: '/charging-activity&/ChargingActivities',
      });
    }

    res.status(200).send({
      message: isTransaction
        ? 'Charging has been started.'
        : 'Please plug the charger into the vehicle to begin charging.',
      data: {
        isPolling: !isTransaction,
        charger: isTransaction ? updateCharger : charger,
      },
    });
  });
};

export const getAllUserCharging = async (req, res) => {
  const { userId } = req.params;
  try {
    const charging = await Charger.find({
      userId,
    }).populate({
      path: 'vehicleId',
      select: '-__v',
      populate: [{ path: 'make', select: '-__v -createdAt -updatedAt' }],
    });
    charging?.map((charger) => {
      charger.vehicleId.make.models = charger?.vehicleId?.make?.models?.filter(
        (model) =>
          model?._id?.toString() === charger?.vehicleId?.model?.toString()
      );
    });

    res.status(200).send({
      charging,
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getSingleUserCharging = async (req, res) => {
  const { userId, chargerId } = req.params;
  try {
    const charging = await Charger.findOne({
      _id: chargerId,
      userId,
    })
      .populate({
        path: 'vehicleId',
        select: '-__v',
        populate: [{ path: 'make', select: '-__v -createdAt -updatededAt' }],
      })
      .exec();
    if (!charging)
      return res
        .status(400)
        .send({ error: 'Something went wrong please try again later.' });
    charging.vehicleId.make.models = charging?.vehicleId?.make?.models?.filter(
      (model) =>
        model?._id?.toString() === charging?.vehicleId?.model?.toString()
    );
    res.status(200).send({
      charging,
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getInProgessCharging = async (req, res) => {
  const { userId } = req.params;
  try {
    const charging = await Charger.findOne({
      status: { $nin: [chargerStatus.cancelled, chargerStatus.charged] },
      userId,
    }).exec();
    if (!charging)
      return res
        .status(201)
        .send({ message: 'No charging is in progress againts this user.' });

    res.status(200).send({
      charging,
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const cancelCharging = async (req, res) => {
  try {
    let currentTime = new Date();
    await cancelChargeSchema.validate(req?.body);
    const { chargerId, userId } = req.body;
    const charging = await Charger.findOne({
      _id: chargerId,
      userId,
    });
    if (!charging)
      return res.status(404).send({
        error: 'No details found against this details.',
      });
    if (charging?._doc?.status === chargerStatus.charged)
      return res.status(400).send({
        error: 'Charging has already been stopped against your record.',
      });
    const update = await Charger.findByIdAndUpdate(chargerId, {
      endTime: currentTime,
      status: chargerStatus.cancelled,
    });
    if (!update)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again later.' });

    await createAndSendNotification({
      userId: update?.userId,
      title: 'Charging request has been cancelled',
      message: `Your charging request has been cancelled at ${currentTime.toLocaleString()}.`,
      url: '/charging-activity&/ChargingActivities',
    });

    res.status(200).send({ message: 'Charging request has been cancelled.' });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const stopCharging = async (req, res) => {
  try {
    let currentTime = new Date();
    await stopChargeSchema.validate(req?.body);
    const charging = await Charger.findOne({
      _id: req?.body?.chargerId,
    });
    if (charging?._doc?.status === 'charged')
      return res.status(400).send({
        error: 'Charging has already been stopped against your record.',
      });

    const payload = {
      idTag: req?.body?.idTag,
      chargeBoxId: req?.body?.chargeBoxId,
      transactionId: charging?.transactionPk,
    };

    if (process.env.SAASCHARGE_DEMO_CHARGER === 'true') {
      payload.soapUrl = req?.body?.soapUrl;
    }

    const result = await saasChargeInstanceDev.post(
      '/command/external/remote-stop',
      payload
    );
    if (result?.data?.status === 'ERROR')
      return res.status(400).send({ error: result?.data?.errors[0] });
    await Account.findOne({
      userId: charging?.userId,
    });
    const update = await Charger.findByIdAndUpdate(req?.body?.chargerId, {
      endTime: currentTime,
      status: chargerStatus.charged,
    });
    if (!update)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again later.' });

    await createAndSendNotification({
      userId: update?.userId,
      title: 'Charging has been stopped',
      message: `Your vehicle charging has been stopped against ${
        req?.body?.chargeBoxId
      } charger at ${currentTime.toLocaleString()}.`,
      url: '/charging-activity&/ChargingActivities',
    });

    res.status(200).send({ message: 'Charging has been stopped.' });
  } catch (error) {
    errorMessage(res, error);
  }
};
