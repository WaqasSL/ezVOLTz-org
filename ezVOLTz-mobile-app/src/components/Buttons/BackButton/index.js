import { ArrowLeft } from "iconsax-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { BLACK, WHITE } from "../../../constants/colors";
import { screenRem, width } from "../../../constants/dimensions";

const BackButton = ({ onPress, extraButtonStyle }) => {
  return (
    <TouchableOpacity
      style={[styles.container, extraButtonStyle]}
      onPress={onPress}
    >
      <ArrowLeft size={screenRem * 1.4} color={BLACK} />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    padding: screenRem,
    borderRadius: width,
  },
});
