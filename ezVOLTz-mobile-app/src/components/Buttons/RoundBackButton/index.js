import { ArrowLeft } from "iconsax-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { BLACK, WHITE } from "../../../constants/colors";
import { screenRem } from "../../../constants/dimensions";

const RoundBackButton = ({ onPress, extraContainerStyles }) => {
  return (
    <TouchableOpacity
      style={[styles.container, extraContainerStyles]}
      onPress={onPress}
    >
      <ArrowLeft size={screenRem * 1.4} color={BLACK} />
    </TouchableOpacity>
  );
};

export default RoundBackButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    width: screenRem * 2.8,
    height: screenRem * 2.8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: screenRem * 2,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
