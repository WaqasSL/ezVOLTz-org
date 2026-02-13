import { createAndSendNotification } from '../../service/notificationService/notification.js';
import { errorMessage } from '../../config/config.js';
import Notifications from '../../models/Notifications.js';
import Account from '../../models/Account.js';

export const getNotifications = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const notifications = await Notifications.find({
      user: req.userInfo?.userId,
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const totalNotifs = await Notifications.countDocuments({
      user: req.userInfo?.userId,
    });
    const notreadNotifsCount = await Notifications.countDocuments({
      user: req.userInfo?.userId,
      read: false,
    });

    res.status(200).send({ notifications, count: totalNotifs, notReadCount: notreadNotifsCount });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const createNotification = async (req, res) => {
  const { userId } = req.userInfo?.userId;
  const { title, message, url } = req.body;
  try {
    const { notification } = await createAndSendNotification({
      userId,
      title,
      message,
      url,
    });
    res.status(201).send(notification);
  } catch (error) {
    errorMessage(res, error);
  }
};

export const createChargingStatusNotification = async (req, res) => {
  try {
    const account = await Account.findOne({
      driverId: req.body?.driverId,
    });

    if (!account)
      return res
        .status(404)
        .send({ message: 'Account against driverId not found' });

    const status = req?.body?.status;
    const percent = req?.body?.soc;

    const { notification } = await createAndSendNotification({
      userId: account?.userId,
      title: 'Charging Alert',
      message: `Vehicle is currently ${status} and is at ${percent}% of charging.`,
      url: '/charging-activity&/ChargingActivities',
    });

    res.status(201).send(notification);
  } catch (error) {
    errorMessage(res, error);
  }
};

export const markNotificationRead = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const updateNotification = await Notifications.findByIdAndUpdate(
      { _id: notificationId },
      { read: true },
      { new: true }
    );
    res.status(200).send(updateNotification);
  } catch (error) {
    errorMessage(res, error);
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const updateNotification = await Notifications.updateMany(
      { user: req.userInfo?.userId },
      { read: true },
      { new: true }
    );
    res.status(200).send(updateNotification);
  } catch (error) {
    errorMessage(res, error);
  }
};

export const markOneAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    const updateNotification = await Notifications.findOneAndUpdate(
      { _id: id, user: req.userInfo?.userId },
      { read: true },
      { new: true }
    );
    res.status(200).send(updateNotification);
  } catch (error) {
    errorMessage(res, error);
  }
};
