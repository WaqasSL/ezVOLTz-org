import React from "react";
import { Platform } from "react-native";
import { PERMISSIONS, RESULTS, request } from "react-native-permissions";

const useCameraServices = (callback) => {
  const requestCameraPermission = async () => {
    try {
      let permission;

      if (Platform.OS === "ios") {
        permission = await request(PERMISSIONS.IOS.CAMERA);
      } else {
        permission = await request(PERMISSIONS.ANDROID.CAMERA);
      }

      switch (permission) {
        case RESULTS.UNAVAILABLE:
          break;
        case RESULTS.DENIED:
          break;
        case RESULTS.LIMITED:
          break;
        case RESULTS.GRANTED:
          callback && callback();
          break;
        case RESULTS.BLOCKED:
          break;
        default:
      }
    } catch (error) {}
  };

  return requestCameraPermission;
};

export default useCameraServices;
