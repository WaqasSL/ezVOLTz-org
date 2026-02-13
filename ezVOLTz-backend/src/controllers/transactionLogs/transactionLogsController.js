import moment from "moment";
import sgMail from "@sendgrid/mail";
import { chargerStatus, errorMessage } from "../../config/config.js";
import stripe from "../../config/stripe/stripe.js";
import Account from "../../models/Account.js";
import TransactionLog from "../../models/TransactionLogModel.js";
import {
  addLogsWebhookSchema,
  updateChargerStatusWebhookSchema,
  addStartChargingWebhookSchema,
} from "../../schema/transactionLogs/transactionLogsSchema.js";
import Charger from "../../models/ChargerModel.js";
import { createAndSendNotification } from "../../service/notificationService/notification.js";
import { CHARGER_STATUSES } from "../../helper/constants.js";
import Notifications from "../../models/Notifications.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const createTransactionLogsWebhook = async (req, res) => {
  try {
    if (req.body?.startTime) return res.status(200).send({ message: "OK" });
    await addStartChargingWebhookSchema.validate(req.body);
    let currentTime = req.body?.startTimestamp
      ? new Date(req.body?.startTimestamp)
      : new Date();
    const chargers = await Charger.find({
      idTag: req.body?.idTag,
      chargeBoxId: req.body?.chargeBoxId,
      connectorId: req.body?.connectorId,
    }).sort({ createdAt: -1 });

    let charger = chargers[0];

    if (!charger)
      return res.status(404).send({
        error: "No charging detail found against the idTag and chargeBoxId",
      });
    else {
      charger = await Charger.findByIdAndUpdate(
        charger._id,
        {
          transactionPk: req.body?.stationTransactionId,
        },
        { new: true }
      );
    }

    const account = await Account.findOne({
      userId: charger?.userId,
    });
    await TransactionLog.create({
      driverId: account?.driverId,
      transactionPk: req.body?.stationTransactionId,
      startTransactionTs: charger?.startTime,
      endTransactionTs: currentTime,
      vehicle: charger?.vehicleId,
      user: charger?.userId,
      charger: charger?._id,
    });
    res.status(200).send({ message: "Transaction started." });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const updateTransactionLogsWebhook = async (req, res) => {
  try {
    await addLogsWebhookSchema.validate(req.body);
    const account = await Account.findOne({
      driverId: req.body?.driverId,
      idTag: req.body?.idTag,
    });
    if (!account)
      return res.status(404).send({
        error: "Id tag or Driver id does not exist in ezVOLTz account.",
      });
    const customer = await stripe.customers.retrieve(account?.customerId);
    const transactionLogs = await TransactionLog.findOne({
      driverId: req.body?.driverId,
      transactionPk: req?.body?.transactionPk,
    });
    if (!transactionLogs)
      return res
        .status(500)
        .send({ error: "Something went wrong please try again." });
    const charger = await Charger.findOne({
      chargeBoxId: req.body?.chargeBoxId,
      connectorId: req?.body?.connectorId,
      idTag: req?.body?.idTag,
    });
    if (charger) {
      if (
        charger.status === chargerStatus.preparing ||
        charger.status === chargerStatus.charging
      ) {
        await Charger.findOneAndUpdate(
          {
            chargeBoxId: req.body?.chargeBoxId,
            connectorId: req?.body?.connectorId,
            idTag: req?.body?.idTag,
          },
          {
            status:
              chargerStatus.preparing === charger.status
                ? chargerStatus.cancelled
                : chargerStatus.charged,
          }
        );
      }
    }
    const updatedTransactionLogs = await TransactionLog.findByIdAndUpdate(
      transactionLogs?._id,
      {
        transactionPk: req?.body?.transactionPk,
        meterValueStart: req?.body?.meterValueStart,
        meterValueStop: req?.body?.meterValueStop,
        paymentId: req?.body?.paymentId,
        kwhConsumed: req?.body?.kwhConsumed,
        totalPrice: req?.body?.calculatedPrice,
        priceDetails: {
          pricePerKwh: req?.body?.priceComponents?.pricePerKwh,
          pricePerMinute: req?.body?.priceComponents?.pricePerMinute,
          priceFlatFee: req?.body?.priceComponents?.priceFlatFee,
          pricePercentFee: req?.body?.priceComponents?.pricePercentFee,
          vatIncluded: req?.body?.priceComponents?.vatIncluded,
        },
      }
    );
    if (!updatedTransactionLogs)
      return res
        .status(500)
        .send({ error: "Something went wrong please try again." });
    const msg = {
      from: process.env.SENDGRID_ACCOUNT_EMAIL,
      template_id: process.env.SENDGRID_TEM_ID_FOR_INVOICE,
      personalizations: [
        {
          to: { email: `${customer?.email}` },
          dynamic_template_data: {
            subject: "Payment Invoice",
            name: customer?.name,
            email: customer?.email,
            chargeBoxId: req?.body?.chargeBoxId,
            connectorId: req?.body?.connectorId,
            connectorName: req?.body?.connectorName,
            meterValueStart: req?.body?.meterValueStart,
            meterValueStop: req?.body?.meterValueStop,
            calculatedPrice: `$${req?.body?.calculatedPrice}`,
            pricePerKwh: `$${req?.body?.priceComponents?.pricePerKwh}`,
            pricePerMinute: `$${req?.body?.priceComponents?.pricePerMinute}`,
            kwhConsumed: req?.body?.kwhConsumed,
            date: moment(new Date(transactionLogs?.endTransactionTs)).format(
              "MMMM DD YYYY, h:mm a"
            ),
          },
        },
      ],
    };
    sgMail
      .send(msg)
      .then(() => {
        res
          .status(200)
          .send({ message: "Transaction stopped. Log has been submitted." });
      })
      .catch((error) => {
        res.status(500).send({
          error: "Something went wrong while sending the email to customer.",
        });
      });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const updateChargerStatusWebhook = async (req, res) => {
  try {
    // Validate the incoming webhook payload
    await updateChargerStatusWebhookSchema.validate(req.body);

    const { chargeBoxId, connectorId, status, timestamp } = req.body;

    // Handle AVAILABLE status specially
    if (status === CHARGER_STATUSES.AVAILABLE) {
      await handleAvailableStatus(chargeBoxId, connectorId);
      return res
        .status(200)
        .send({ message: "Status update processed successfully" });
    }

    // For other statuses, find active charging activities
    const chargingActivity = await Charger.findOne({
      chargeBoxId,
      connectorId,
      status: { $nin: [chargerStatus.cancelled, chargerStatus.charged] },
    });

    if (!chargingActivity) {
        return res
          .status(200)
          .send({
            message: "No active charging activity found for this charger",
          });
    }

    // Process the status update
    await processChargerStatusUpdate(chargingActivity, status, timestamp);

    return res
      .status(200)
      .send({ message: `Charging status updated to ${status}.` });
  } catch (error) {
    console.error("Error processing status update webhook:", error);
    errorMessage(res, error);
  }
};

// Helper function to handle AVAILABLE status
const handleAvailableStatus = async (chargeBoxId, connectorId) => {
  const preparingActivity = await Charger.findOne({
    chargeBoxId,
    connectorId,
    status: { $in: [chargerStatus.preparing, chargerStatus.charging]},
  });
  if(preparingActivity) {
    await Charger.findByIdAndUpdate(preparingActivity._id, {
      status: preparingActivity?.status === chargerStatus.charging ? chargerStatus.charged : chargerStatus.cancelled,
    });
    await createAndSendNotification({
      userId: preparingActivity?.userId,
      title: "Charger Available",
      message: `Charger ${chargeBoxId} is now available for use.`,
      url: "/charging-activity&/ChargingActivities",
      metadata: {
        status: chargerStatus.available,
        chargeBoxId: chargeBoxId,
        connectorId: connectorId,
      },
    });
  } else {
    // For AVAILABLE status, find the most recent charging activity for this charger
    const recentActivity = await Charger.findOne({
      chargeBoxId,
      connectorId,
    }).sort({ updatedAt: -1 });

    if (recentActivity) {
      // Check if the last notification was sent within the last 30 seconds
      const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);

      // Check if the activity was updated within the last 30 seconds
      const isRecentActivity = recentActivity.updatedAt > thirtySecondsAgo;

      // Check if we've already sent a notification recently
      const recentNotification = await Notifications.findOne({
        user: recentActivity.userId,
        "metadata.status": chargerStatus.available,
        "metadata.connectorId": connectorId,
        "metadata.chargeBoxId": chargeBoxId, 
        createdAt: { $gt: thirtySecondsAgo },
      }).sort({ createdAt: -1 });

      // Only send notification if it's a recent activity and we haven't sent one recently
      if (isRecentActivity && !recentNotification) {
        // Send notification to the user of the most recent activity
        await createAndSendNotification({
          userId: recentActivity?.userId,
          title: "Charger Available",
          message: `Charger ${chargeBoxId} is now available for use.`,
          url: "/charging-activity&/ChargingActivities",
          metadata: {
            status: chargerStatus.available,
            chargeBoxId: chargeBoxId,
            connectorId: connectorId,
          },
        });

        console.log(
          `Sent availability notification for charger ${chargeBoxId}, connector ${connectorId}`
        );
      } else if (!isRecentActivity) {
        console.log(
          `Activity for charger ${chargeBoxId}, connector ${connectorId} is older than 30 seconds, skipping notification`
        );
      } else {
        console.log(
          `Already sent notification for charger ${chargeBoxId}, connector ${connectorId} in the last 30 seconds, skipping`
        );
      }
    }
  }
};

// Helper function to process charger status updates
const processChargerStatusUpdate = async (
  chargingActivity,
  status,
  timestamp
) => {
  let mappedStatus;
  let notificationTitle;
  let notificationMessage;

  switch (status?.toLowerCase()) {
    case CHARGER_STATUSES.PREPARING?.toLowerCase():
      mappedStatus = chargerStatus.preparing;
      notificationTitle = "Charging Preparation";
      notificationMessage = `Your charging session is being prepared at ${chargingActivity.chargeBoxId}.`;
      break;

    case CHARGER_STATUSES.CHARGING?.toLowerCase():
      mappedStatus = chargerStatus.charging;
      notificationTitle = "Charging Started";
      notificationMessage = `Your vehicle has started charging at ${chargingActivity.chargeBoxId}.`;
      break;

    case CHARGER_STATUSES.SUSPENDED_EV?.toLowerCase():
    case CHARGER_STATUSES.SUSPENDED_EVSE?.toLowerCase():
      mappedStatus = chargerStatus.suspended;
      notificationTitle = "Charging Suspended";
      notificationMessage = `Your charging session has been suspended at ${chargingActivity.chargeBoxId}.`;
      break;

    case CHARGER_STATUSES.FINISHING?.toLowerCase():
    case CHARGER_STATUSES.FINISHED?.toLowerCase():
      mappedStatus = chargerStatus.charged;
      notificationTitle = "Charging Complete";
      notificationMessage = `Your vehicle has completed charging at ${chargingActivity.chargeBoxId}.`;
      break;

    case CHARGER_STATUSES.RESERVED?.toLowerCase():
      mappedStatus = chargerStatus.cancelled;
      notificationTitle = "Charging Cancelled";
      notificationMessage = `Your charging session was cancelled because the charger ${chargingActivity.chargeBoxId} has been reserved.`;
      break;

    case CHARGER_STATUSES.FAULTED?.toLowerCase():
      mappedStatus = chargerStatus.faulted;
      notificationTitle = "Charging Error";
      notificationMessage = `There was an error with your charging session at ${chargingActivity.chargeBoxId}.`;
      break;

    case CHARGER_STATUSES.UNAVAILABLE?.toLowerCase():
      mappedStatus = chargerStatus.charged;
      notificationTitle = "Charger Unavailable";
      notificationMessage = `Your charging session was cancelled because charger ${chargingActivity.chargeBoxId} became unavailable.`;
      break;

    default:
      notificationTitle = "Charging Status Update";
      notificationMessage = `Your charging status at ${chargingActivity.chargeBoxId} has been updated to ${status}.`;
  }

  // Update the charging activity status if needed
  if (mappedStatus) {
    await Charger.findByIdAndUpdate(chargingActivity._id, {
      status: mappedStatus,
      ...(mappedStatus === chargerStatus.charged
        ? { endTime: new Date(timestamp) }
        : {}),
    });
  }

  // Send notification to the user
  await createAndSendNotification({
    userId: chargingActivity?.userId,
    title: notificationTitle,
    message: notificationMessage,
    metadata: {
      status: mappedStatus,
      chargeBoxId: chargingActivity?.chargeBoxId,
      connectorId: chargingActivity?.connectorId,
    },
    url: "/charging-activity&/ChargingActivities",
  });
};

export const cancelChargingWebhook = async (req, res) => {
  try {
    let currentTime = req.body?.timestamp
      ? new Date(req.body?.timestamp)
      : new Date();

    const charging = await Charger.findOne({
      chargeBoxId: req.body?.chargebox_id,
      connectorId: req.body?.connectorId,
    });
    if (!charging)
      return res.status(404).send({
        error:
          "No charging detail found against the connectorId and chargeBoxId",
      });
    const update = await Charger.findByIdAndUpdate(charging._id, {
      endTime: currentTime,
      status: chargerStatus.cancelled,
    });
    if (!update)
      return res
        .status(500)
        .send({ error: "Something went wrong please try again later." });
    await createAndSendNotification({
      userId: update?.userId,
      title: "Charging has been cancelled",
      message: `Your vehicle charging has been stopped against ${
        req?.body?.chargeBoxId
      } charger at ${currentTime.toLocaleString()}.`,
      url: "/charging-activity&/ChargingActivities",
    });
    res.status(200).send({ message: "Charging hasn been cancelled." });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getTransactionLogByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactionLogs = await TransactionLog.find({
      user: userId,
    });
    res.status(200).send({ transactionLogs });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getTransactionLogByUserAndCharger = async (req, res) => {
  try {
    const { userId, chargerId } = req.params;
    const transaction = await TransactionLog.findOne({
      user: userId,
      charger: chargerId,
    })
      .populate("charger")
      .populate({
        path: "vehicle",
        select: "-__v",
        populate: [{ path: "make", select: "-__v" }],
      })
      .exec();
    if (!transaction)
      return res.status(404).send({ error: "No transaction detail found." });
    transaction.vehicle.make.models = transaction.vehicle?.make?.models?.filter(
      (model) =>
        model?._id?.toString() === transaction.vehicle?.model?.toString()
    );
    res.status(200).send({ transaction });
  } catch (error) {
    errorMessage(res, error);
  }
};
