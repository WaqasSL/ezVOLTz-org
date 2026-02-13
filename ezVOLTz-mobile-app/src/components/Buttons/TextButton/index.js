import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { BERTIOGASANS_MEDIUM } from "../../../constants/fonts";
import { screenRem } from "../../../constants/dimensions";

const TextButton = ({ label, customTextStyle, onPress, disable }) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disable}>
      <Text style={[styles.textStyle, customTextStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default TextButton;

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.2,
  },
});
