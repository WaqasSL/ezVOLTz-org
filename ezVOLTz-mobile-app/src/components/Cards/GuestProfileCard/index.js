import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import HorizontalSpace from "../../../components/HorizontalSpace";
import SolidButton from "../../../components/Buttons/SolidButton";
import VerticalSpace from "../../../components/VerticalSpace";
import TextButton from "../../../components/Buttons/TextButton";

import { BLUE_LOBSTER, WHITE_SMOKE } from "../../../constants/colors";
import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";
import images from "../../../constants/images";
import { BERTIOGASANS_MEDIUM } from "../../../constants/fonts";
import FastImage from "react-native-fast-image";

const GuestProfileCard = ({
  onAccessAccountPress,
  onPersonalInformationPress,
}) => {
  return (
    <View style={styles.container}>
      <FastImage
        source={images.defaultUser}
        style={styles.image}
        resizeMode={"contain"}
      />

      <HorizontalSpace w={4} />

      <View>
        <Text style={styles.userText}>Guest User</Text>

        <VerticalSpace h={1} />

        <View style={styles.buttonsContainer}>
          <SolidButton
            label={`Log In`}
            customButtonStyle={styles.loginCutomButtonStyle}
            size={`sm`}
            onPress={onAccessAccountPress}
          />

          <HorizontalSpace w={6} />

          <TextButton
            label={`Sign Up`}
            customTextStyle={styles.signupCustomTextStyle}
            onPress={onPersonalInformationPress}
          />
        </View>
      </View>
    </View>
  );
};

export default GuestProfileCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: widthRem * 4,
    paddingVertical: heightRem * 2,
    backgroundColor: WHITE_SMOKE,
    borderRadius: screenRem * 2,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    height: screenRem * 7,
    width: screenRem * 7,
  },
  userText: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.3,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginCutomButtonStyle: { paddingVertical: heightRem * 1.2 },
  signupCustomTextStyle: { color: BLUE_LOBSTER },
});
