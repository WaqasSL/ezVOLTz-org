import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import LottieAnimationView from "../LottieAnimationView";
import SolidButton from "../Buttons/SolidButton";
import VerticalSpace from "../VerticalSpace";

import { height, heightRem, screenRem } from "../../constants/dimensions";
import { BERTIOGASANS_MEDIUM } from "../../constants/fonts";
import { BLACK, FLINT_STONE, JASPER_CANE } from "../../constants/colors";

const EmptyList = ({ label, buttonLable, onPress, displayButton }) => {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={styles.container}>
      <LottieAnimationView
        source={require(`../../assets/json/NotFound.json`)}
        autoPlay={true}
        loop={true}
        customLottieStyle={styles.lottieStyle}
      />

      <Text style={styles.emptyListText}>{label}</Text>

      <VerticalSpace h={2} />

      {displayButton && (
        <SolidButton
          label={buttonLable}
          size={`lg`}
          customButtonStyle={styles.customButton}
          customTextStyle={styles.customText}
          onPress={onPress}
        />
      )}

      <View style={{ height: tabBarHeight }} />
    </View>
  );
};

export default EmptyList;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: heightRem * 70,
  },
  lottieStyle: {
    height: screenRem * 12,
    width: screenRem * 12,
  },
  emptyListText: {
    fontSize: screenRem * 1.1,
    fontFamily: BERTIOGASANS_MEDIUM,
    color: FLINT_STONE,
  },
  customButton: {
    backgroundColor: JASPER_CANE,
    alignSelf: "center",
  },
  customText: { color: BLACK },
});
