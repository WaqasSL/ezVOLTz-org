import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import MaskInput from "react-native-mask-input";
import { useField } from "formik";

import { BLACK, PINBALL, WILD_DOVE } from "../../../constants/colors";
import { BERTIOGASANS_REGULAR } from "../../../constants/fonts";
import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";
import { isUndefined } from "lodash";

const PhoneButtonTextInput = ({ mask, button, editable, ...props }) => {
  return (
    <View style={styles.textInputContainer}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.leftText}>+1</Text>

        <MaskInput
          {...props}
          mask={mask}
          style={[
            styles.textInput,
            {
              color: isUndefined(editable) ? BLACK : WILD_DOVE,
            },
          ]}
          placeholderTextColor={PINBALL}
          keyboardType={"phone-pad"}
          editable={editable}
        />
      </View>

      {button}
    </View>
  );
};

export default PhoneButtonTextInput;

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    width: widthRem * 92,
    borderRadius: screenRem * 4,
    height: heightRem * 5,
    borderColor: PINBALL,
    paddingHorizontal: screenRem * 2,
  },
  leftText: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.2,
    marginBottom: Platform.OS === "ios" ? -heightRem * 0.2 : heightRem * 0.4,
  },
  textInput: {
    fontFamily: BERTIOGASANS_REGULAR,
    alignItems: "center",
    textAlignVertical: "center",
    paddingLeft: widthRem * 2,
    fontSize: screenRem * 1.2,
  },
});
