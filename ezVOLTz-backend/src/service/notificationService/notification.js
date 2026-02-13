import admin from 'firebase-admin';
import Notifications from '../../models/Notifications.js';
import User from '../../models/UserModel.js';

export async function sendNotification({ token, title, body, data, userId }) {
  await admin
    .messaging()
    .send({
      token,
      notification: {
        title,
        body,
      },
      data,
    })
    .then((response) => response)
    .catch(async (error) => {
      // Delete token for user if error code is UNREGISTERED or INVALID_ARGUMENT.
      if (error.code == 'messaging/registration-token-not-registered') {
        await User.findByIdAndUpdate(
          userId,
          {
            $pull: {
              firebaseTokens: { token },
            },
          },
          { new: true }
        );
      }
    });
}

export const createAndSendNotification = async ({
  userId,
  title,
  message,
  metadata,
  url,
}) => {
  try {
    const responses = [];
    const user = await User.findById(userId);

    const notification = await Notifications.create({
      title,
      message,
      url,
      user: userId,
      metadata: {
        status: metadata?.status || null,
        chargeBoxId: metadata?.chargeBoxId || null,
        connectorId: metadata?.connectorId || null,
      },
    });
    if (user?.firebaseTokens?.length > 0) {
      for (const tokenData of user?.firebaseTokens) {
        const result = await sendNotification({
          token: tokenData?.token,
          title,
          body: message,
          data: {
            url,
          },
          userId,
        });
        responses.push(result);
      }
    }

    return { notification, responses };
  } catch (error) {
    console.log('Error in createAndSendNotification', error);
  }
};
