import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import HorizontalSpace from "../HorizontalSpace";

import { heightRem, screenRem } from "../../constants/dimensions";
import { FLINT_STONE, WHITE_SMOKE } from "../../constants/colors";
import { BERTIOGASANS_REGULAR } from "../../constants/fonts";

const Dropzone = ({ label, onPress }) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.plusText}>+</Text>

      <HorizontalSpace w={4} />

      <Text style={styles.labelText}>{label}</Text>
    </Pressable>
  );
};

export default Dropzone;

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE_SMOKE,
    paddingVertical: heightRem * 4,
    alignItems: "center",
    borderRadius: screenRem,
    flexDirection: "row",
    justifyContent: "center",
  },
  plusText: {
    fontSize: screenRem * 2.4,
    fontFamily: BERTIOGASANS_REGULAR,
    color: FLINT_STONE,
  },
  labelText: {
    fontSize: screenRem * 1.3,
    fontFamily: BERTIOGASANS_REGULAR,
  },
});
