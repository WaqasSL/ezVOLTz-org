import React from "react";
import { StyleSheet, Text } from "react-native";
import { isUndefined } from "lodash";
import { TextInput } from "react-native-paper";

import {
  BERN_RED,
  BLACK,
  FLINT_STONE,
  PINBALL,
  THEME,
  WHITE,
} from "../../../constants/colors";
import { BERTIOGASANS_REGULAR } from "../../../constants/fonts";
import {
  heightRem,
  screenRem,
  width,
  widthRem,
} from "../../../constants/dimensions";
import { textInputBorderRound } from "../../../constants/miscellaneous";

const OutlineIconTextInput = ({
  value,
  placeholder,
  secureTextEntry,
  onChangeText,
  onBlur,
  editable,
  right,
  meta,
  extraTextInputStyles,
}) => {
  return (
    <>
      <TextInput
        label={placeholder}
        value={value}
        onChangeText={onChangeText}
        mode={`outlined`}
        style={[styles.textInput, extraTextInputStyles]}
        activeOutlineColor={THEME}
        outlineColor={PINBALL}
        theme={{
          roundness: textInputBorderRound,
          colors: {
            text: isUndefined(editable) ? BLACK : FLINT_STONE,
          },
        }}
        secureTextEntry={secureTextEntry}
        onBlur={onBlur}
        editable={editable} //by default editable will be consider true
        right={right}
        autoCapitalize="none"
      />
      {meta.error && <Text style={styles.errorMessage}>{meta.error}</Text>}
    </>
  );
};

export default OutlineIconTextInput;

const styles = StyleSheet.create({
  textInput: {
    width: widthRem * 92,
    backgroundColor: WHITE,
    fontSize: screenRem,
    fontFamily: BERTIOGASANS_REGULAR,
    paddingHorizontal: widthRem * 2,
    height: heightRem * 5,
    lineHeight: 32,
  },
  errorMessage: {
    color: BERN_RED,
    fontSize: screenRem,
    fontFamily: BERTIOGASANS_REGULAR,
    marginLeft: widthRem * 4,
    marginTop: heightRem * 0.8,
    marginBottom: heightRem * 0.2,
  },
});
