import React from "react";
import { StyleSheet, TextInput } from "react-native";

import { BERTIOGASANS_REGULAR } from "../../constants/fonts";
import { heightRem, screenRem, widthRem } from "../../constants/dimensions";
import { PINBALL } from "../../constants/colors";

const TextArea = ({ placeholder, onChangeText, onBlur, value }) => {
  return (
    <TextInput
      placeholder={placeholder}
      style={styles.textInput}
      multiline={true}
      numberOfLines={6}
      onChangeText={onChangeText}
      onBlur={onBlur}
      value={value}
      autoCapitalize={"none"}
    />
  );
};

export default TextArea;

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1.2,
    paddingHorizontal: widthRem * 4,
    paddingTop: heightRem * 2,
    borderRadius: screenRem,
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.1,
    height: 160,
    borderColor: PINBALL,
    textAlignVertical: "top",
  },
});
