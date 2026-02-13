import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
} from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";
import { store } from "../redux/store";
import DeviceInfo from "react-native-device-info";

import { restInstance } from "./instance";
import { notificationUrl } from "./functions";
import { navigate, reset } from "./navigationHandler";
import {
  setIsNotificationDot,
  setNotification,
  setNotificationId,
  setNotificationsFields,
} from "../redux/slices/notifications/slice";
import {
  check,
  PERMISSIONS,
  requestNotifications,
  request,
  RESULTS,
  openSettings,
} from "react-native-permissions";

const checkNotificationPermission = async () => {
  const result = await check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  return result;
};

export const requestUserPermission = async () => {
  try {
    if (Platform.OS === "android") {
      const androidVersion = DeviceInfo.getSystemVersion();
      if (androidVersion >= 13) {
        requestNotifications(["alert", "sound"]).then(() => {});
      } else {
        const res = await checkNotificationPermission();
        switch (res) {
          case RESULTS.UNAVAILABLE:
            console.log(
              "This feature is not available (on this device / in this context)",
            );
            break;
          case RESULTS.DENIED:
            console.log(
              "The permission has not been requested / is denied but requestable",
            );
            break;
          case RESULTS.LIMITED:
            console.log("The permission is limited: some actions are possible");
            break;
          case RESULTS.GRANTED:
            console.log("The permission is granted");
            break;
          case RESULTS.BLOCKED:
            openSettings().catch(() => console.warn("cannot open settings"));
            break;
        }
        await request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      }
    } else if (Platform.OS === "ios") {
      await messaging().requestPermission();
    }
    await notifee.requestPermission();
    saveFcmOnServer();
  } catch (error) {
    console.warn(error);
  }
};

export const notificationListener = async () => {
  notifee.setBadgeCount(0);
  messaging().onNotificationOpenedApp((remoteMessage) => {});

  messaging().onMessage((remoteMessage) => {
    console.log("remoteMessageremoteMessageremoteMessage", remoteMessage);
    if (
      remoteMessage?.messageId !== store.getState().notifications.notificationId
    ) {
      onDisplayNotification(remoteMessage);
      store.dispatch(setIsNotificationDot(true));
      store.dispatch(setNotificationId(remoteMessage?.messageId));
      store.dispatch(setNotification(remoteMessage?.data));
      getAllNotifications();
    }
  });
  messaging().onNotificationOpenedApp((remoteMessage) => {
    handleNotificationClick(EventType.PRESS, remoteMessage?.data);
  });

  notifee.onForegroundEvent(({ type, detail }) => {
    handleNotificationClick(type, detail?.notification?.data);
  });
  notifee.onBackgroundEvent(({ type, detail }) => {
    handleNotificationClick(type, detail?.notification?.data);
  });

  const handleNotificationClick = (type, data) => {
    switch (type) {
      case EventType.PRESS:
        if (data) {
          navigate("ChargingActivities");
        }
        break;
    }
  };

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    return backgroundHandler();
  });

  const backgroundHandler = async () => {
    await notifee.requestPermission();
    await notifee.createChannel({
      id: "default",
      name: "ezVoltz",
      importance: AndroidImportance.HIGH,
      sound: "default",
    });
  };

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
      }
    });
};

const onDisplayNotification = async (remoteMessage) => {
  try {
    await notifee.requestPermission();
  } catch (err) {
    console.log(err);
  }

  const channelId = await notifee.createChannel({
    id: remoteMessage.messageId,
    name: "ezVoltz",
    sound: "default",
    vibration: true,
    vibrationPattern: [300, 500],
    lights: true,
    importance: AndroidImportance.HIGH,
  });

  try {
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      data: remoteMessage.data,
      ios: {
        sound: "default",
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      },
      android: {
        smallIcon: "ic_notification",
        largeIcon: "ic_notification",
        channelId,
        sound: "default",
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
      },
    });
  } catch (err) {
    console.log(err, "Error while display notification");
  }
};

const saveFcmOnServer = async () => {
  const token = await messaging().getToken();
  console.log("token----------", token);
  const type = Platform.OS;
  const data = {
    type: type,
    token: token,
  };

  const result = await restInstance.post("user/update-firebase-token", data);
  // const result = await apiInstance('post', 'user/update-firebase-token', data);
  console.log("result-----update", result.data);
};

const getAllNotifications = async () => {
  const response = await restInstance.get(`notifications/all?page=1&limit=10`);

  if (response.status === 200) {
    store.dispatch(
      setNotificationsFields({
        notReadNotificationsCount: response?.data?.notReadCount,
      }),
    );
  }
};
