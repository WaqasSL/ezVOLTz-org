import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

import HorizontalSpace from "../HorizontalSpace";

import {
  BLACK,
  FRIENDLY_BASILISK,
  JASPER_CANE,
  THEME,
  WHITE_SMOKE,
} from "../../constants/colors";
import {
  heightRem,
  screenRem,
  width,
  widthRem,
} from "../../constants/dimensions";
import { BERTIOGASANS_REGULAR } from "../../constants/fonts";

const CustomSelect = ({ label, onCustomSelectPress, value, children }) => {
  return (
    <Pressable style={styles.container(value)} onPress={onCustomSelectPress}>
      {children}
      <HorizontalSpace w={2} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

export default CustomSelect;

const styles = StyleSheet.create({
  container: (value) => ({
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingVertical: heightRem * 1.2,
    paddingHorizontal: widthRem * 3,
    borderRadius: width,
    marginRight: widthRem * 2,
    borderColor: value ? THEME : JASPER_CANE,
    backgroundColor: value ? FRIENDLY_BASILISK : WHITE_SMOKE,
  }),
  label: {
    fontSize: screenRem * 1.1,
    fontFamily: BERTIOGASANS_REGULAR,
    color: BLACK,
  },
});
