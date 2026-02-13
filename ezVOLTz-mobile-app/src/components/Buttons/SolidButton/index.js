import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { BERTIOGASANS_MEDIUM } from "../../../constants/fonts";
import { ButtonSize } from "../../../constants/enum";
import {
  JASPER_CANE,
  THEME,
  WHITE,
  WILD_DOVE,
} from "../../../constants/colors";
import { heightRem, screenRem, width } from "../../../constants/dimensions";

const SolidButton = ({
  label,
  customTextStyle,
  customButtonStyle,
  onPress,
  size,
  children,
  disable,
}) => {
  return (
    <TouchableOpacity
      disabled={disable}
      onPress={onPress}
      style={[styles.buttonStyle(size, disable), customButtonStyle]}
    >
      <Text style={[styles.textStyle(disable), customTextStyle]}>{label}</Text>
      {children}
    </TouchableOpacity>
  );
};

export default SolidButton;

const styles = StyleSheet.create({
  buttonStyle: (size, disable) => ({
    backgroundColor: disable ? JASPER_CANE : THEME,
    width: ButtonSize[size],
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: heightRem * 1.6,
    borderRadius: width,
    flexDirection: "row",
  }),
  textStyle: (disable) => ({
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.2,
    color: disable ? WILD_DOVE : WHITE,
  }),
});
