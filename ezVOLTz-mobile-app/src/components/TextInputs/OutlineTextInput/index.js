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
  WILD_DOVE,
} from "../../../constants/colors";
import { BERTIOGASANS_REGULAR } from "../../../constants/fonts";
import {
  heightRem,
  screenRem,
  width,
  widthRem,
} from "../../../constants/dimensions";
import { textInputBorderRound } from "../../../constants/miscellaneous";

const OutlineTextInput = ({
  value,
  placeholder,
  secureTextEntry,
  onChangeText,
  onBlur,
  editable,
  maxLength,
  keyboardType,
  meta,
  extraErrorStyles,
}) => {
  return (
    <>
      <TextInput
        label={placeholder}
        value={value}
        onChangeText={onChangeText}
        mode={`outlined`}
        style={styles.textInput}
        activeOutlineColor={THEME}
        outlineColor={PINBALL}
        theme={{
          roundness: textInputBorderRound,
          colors: {
            text: isUndefined(editable) ? BLACK : WILD_DOVE,
          },
        }}
        secureTextEntry={secureTextEntry}
        onBlur={onBlur}
        editable={editable}
        autoCapitalize="none"
        maxLength={maxLength}
        keyboardType={keyboardType}
      />
      {meta?.error && (
        <Text style={[styles.errorMessage, extraErrorStyles]}>
          {meta?.error}
        </Text>
      )}
    </>
  );
};

export default OutlineTextInput;

const styles = StyleSheet.create({
  textInput: {
    width: widthRem * 92,
    backgroundColor: WHITE,
    fontSize: screenRem * 1.1,
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
