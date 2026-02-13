import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { BERTIOGASANS_MEDIUM } from "../../../constants/fonts";
import { ButtonSize } from "../../../constants/enum";
import { THEME, WHITE } from "../../../constants/colors";
import { heightRem, screenRem, width } from "../../../constants/dimensions";

const HollowButton = ({
  label,
  customTextStyle,
  customButtonStyle,
  onPress,
  size,
  children,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.buttonStyle(size), customButtonStyle]}
    >
      <Text style={[styles.textStyle, customTextStyle]}>{label}</Text>
      {children}
    </TouchableOpacity>
  );
};

export default HollowButton;

const styles = StyleSheet.create({
  buttonStyle: (size) => ({
    backgroundColor: WHITE,
    width: ButtonSize[size],
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: heightRem * 1.6,
    borderRadius: width,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: THEME,
  }),
  textStyle: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.2,
    color: THEME,
  },
});
