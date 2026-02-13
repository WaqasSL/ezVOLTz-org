import React, { useRef } from "react";
import { Platform, StyleSheet, Text, View, Pressable } from "react-native";
import MaskInput from "react-native-mask-input";
import { useField } from "formik";

import { PINBALL, WILD_DOVE } from "../../../constants/colors";
import { BERTIOGASANS_REGULAR } from "../../../constants/fonts";
import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";

const PhoneTextInput = ({ mask, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const maskInputRef = useRef(null);

  const handlePress = () => {
    maskInputRef.current.focus();
  };

  const handleOnChange = (maskedText, rawText) => {
    helpers.setValue(rawText);
  };

  return (
    <Pressable style={styles.textInputContainer} onPress={handlePress}>
      <Text style={styles.leftText}>+1</Text>
      <MaskInput
        {...field}
        {...props}
        ref={maskInputRef}
        mask={mask}
        onChangeText={handleOnChange}
        style={styles.textInput}
        placeholderTextColor={WILD_DOVE}
        keyboardType={"phone-pad"}
      />
    </Pressable>
  );
};

export default PhoneTextInput;

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    width: widthRem * 92,
    borderRadius: screenRem * 4,
    paddingVertical: heightRem * 1.6,
    borderColor: PINBALL,
    paddingVertical: Platform.OS === "ios" ? 0 : 0,
    paddingHorizontal: screenRem * 2,
    marginTop: heightRem * 0.4,
    height: heightRem * 5,
  },
  leftText: { fontFamily: BERTIOGASANS_REGULAR, fontSize: screenRem },
  textInput: {
    fontFamily: BERTIOGASANS_REGULAR,
    alignItems: "center",
    textAlignVertical: "center",
    paddingLeft: widthRem * 2,
    fontSize: screenRem * 1.1,
    width: "100%",
  },
});
