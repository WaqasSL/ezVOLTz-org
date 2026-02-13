import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Send2 } from "iconsax-react-native";
import { MaterialIndicator } from "react-native-indicators";

import {
  heightRem,
  screenRem,
  width,
  widthRem,
} from "../../../constants/dimensions";
import {
  PINBALL,
  BLUE_LOBSTER,
  FLINT_STONE,
  THEME,
} from "../../../constants/colors";
import { BERTIOGASANS_REGULAR } from "../../../constants/fonts";

const ReplyTextInput = ({
  value,
  onChangeText,
  placeholder,
  onReplySubmit,
  replySubmit,
}) => {
  return (
    <View style={styles.textInputContainer}>
      <TextInput
        placeholder={placeholder}
        style={styles.textInput}
        autoCapitalize="none"
        value={value}
        onChangeText={onChangeText}
        editable={!replySubmit}
      />

      {replySubmit ? (
        <MaterialIndicator size={18} color={THEME} />
      ) : (
        <TouchableOpacity onPress={onReplySubmit}>
          <Send2 color={BLUE_LOBSTER} variant={`Bold`} size={screenRem * 2} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ReplyTextInput;

const styles = StyleSheet.create({
  textInputContainer: {
    paddingVertical: heightRem * 1.4,
    borderWidth: 1,
    borderRadius: width,
    borderColor: PINBALL,
    paddingHorizontal: widthRem * 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textInput: {
    width: `82%`,
    fontFamily: BERTIOGASANS_REGULAR,
    color: FLINT_STONE,
  },
});
