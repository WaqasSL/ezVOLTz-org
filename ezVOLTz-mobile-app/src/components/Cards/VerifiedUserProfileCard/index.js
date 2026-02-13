import React from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

import HorizontalSpace from "../../../components/HorizontalSpace";
import SolidButton from "../../../components/Buttons/SolidButton";
import VerticalSpace from "../../../components/VerticalSpace";
import TextButton from "../../../components/Buttons/TextButton";
import ProgressiveImage from "../../../components/ProgressiveImage";

import {
  BERN_RED,
  BLACK,
  BLUE_LOBSTER,
  FLINT_STONE,
  WHITE_SMOKE,
} from "../../../constants/colors";
import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";
import images from "../../../constants/images";
import {
  BERTIOGASANS_BOLD,
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../../constants/fonts";

const VerifiedUserProfileCard = ({ onSignOutPress }) => {
  const { auth } = useSelector((state) => state);

  return (
    <View style={styles.container}>
      <ProgressiveImage
        source={
          auth.user?.profileImage === ""
            ? images.defaultUser
            : { uri: auth.user?.profileImage }
        }
        style={styles.image}
        defaultImageSource={images.progressiveImage}
      />

      <HorizontalSpace w={4} />

      <View>
        <Text style={styles.nameText}>{auth.user?.name}</Text>
        <VerticalSpace h={1} />

        <Text style={styles.emailText}>{auth.user?.email}</Text>

        <VerticalSpace h={2} />

        <TextButton
          label={`Sign Out`}
          customTextStyle={styles.signoutCustomTextStyle}
          onPress={onSignOutPress}
        />
      </View>
    </View>
  );
};

export default VerifiedUserProfileCard;

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
    borderRadius: screenRem * 4,
  },
  nameText: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.4,
    color: BLACK,
  },
  emailText: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.2,
    color: FLINT_STONE,

    width: widthRem * 58,
  },
  signoutCustomTextStyle: { color: BERN_RED },
});
