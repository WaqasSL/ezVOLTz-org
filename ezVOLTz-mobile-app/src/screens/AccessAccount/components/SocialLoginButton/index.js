import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";

import VerticalSpace from "../../../../components/VerticalSpace";

import { FLINT_STONE, PINBALL } from "../../../../constants/colors";
import { BERTIOGASANS_REGULAR } from "../../../../constants/fonts";
import { screenRem } from "../../../../constants/dimensions";

const SocialLoginButton = ({ label, onPress, children }) => {
  return (
    <View style={styles.socialLoginButtonContainer}>
      <Pressable onPress={onPress} style={styles.iconContainer}>
        {children}
      </Pressable>
      <VerticalSpace h={1} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default SocialLoginButton;

const styles = StyleSheet.create({
  socialLoginButtonContainer: {
    alignItems: "center",
  },
  iconContainer: {
    height: screenRem * 4,
    width: screenRem * 4,
    borderWidth: 1,
    borderRadius: screenRem * 2.5,
    borderColor: PINBALL,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: FLINT_STONE,
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem,
  },
});
