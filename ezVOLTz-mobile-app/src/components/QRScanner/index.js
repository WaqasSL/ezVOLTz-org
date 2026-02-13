import React from "react";
import { StyleSheet, Text } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";

import { THEME } from "../../constants/colors";
import { screenRem } from "../../constants/dimensions";

const QRScanner = () => {
  return (
    <QRCodeScanner
      flashMode={RNCamera.Constants.FlashMode.torch}
      cameraStyle={styles.camera}
    />
  );
};

export default QRScanner;

const styles = StyleSheet.create({
  camera: {
    height: screenRem * 20,
    width: screenRem * 20,
    borderWidth: 2,
    borderColor: THEME,
    alignSelf: "center",
  },
});
