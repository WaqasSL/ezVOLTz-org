import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { TickSquare } from "iconsax-react-native";

import HorizontalSpace from "../HorizontalSpace";

import { heightRem, screenRem, widthRem } from "../../constants/dimensions";
import { FLINT_STONE, THEME } from "../../constants/colors";
import { BERTIOGASANS_REGULAR } from "../../constants/fonts";

const CheckBox = ({
  label,
  onPress,
  text,
  value,
  customLabelTextStyles,
  variant,
  color,
}) => {
  return (
    <Pressable style={styles.checkBoxContainer} onPress={onPress}>
      <TickSquare
        size={screenRem * 1.8}
        color={color ? color : value ? THEME : FLINT_STONE}
        variant={variant ? variant : value ? "Bold" : "Linear"}
      />

      <HorizontalSpace w={2} />
      {text ? (
        text
      ) : (
        <Text style={[styles.checkBoxLabel, customLabelTextStyles]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  checkBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkBoxLabel: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.3,
    color: FLINT_STONE,
    width: widthRem * 80,
  },
});
