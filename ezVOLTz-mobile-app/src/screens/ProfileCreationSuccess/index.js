import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

import VerticalSpace from "../../components/VerticalSpace";
import TextButton from "../../components/Buttons/TextButton";
import LottieAnimationView from "../../components/LottieAnimationView";
import Card from "./components/Card";

import { heightRem, screenRem, widthRem } from "../../constants/dimensions";
import { BERTIOGASANS_BOLD, BERTIOGASANS_REGULAR } from "../../constants/fonts";
import { GREEN_CAR, ROUTE } from "../../assets/icons";
import { BLACK, FLINT_STONE, THEME, WHITE } from "../../constants/colors";

const ProfileCreationSuccess = () => {
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <LottieAnimationView
        source={require(`../../assets/json/PartyPopper.json`)}
        autoPlay={true}
        loop={false}
        customLottieStyle={{
          height: screenRem * 24,
          width: screenRem * 24,
          position: "absolute",
          zIndex: 1,
        }}
      />

      <LottieAnimationView
        source={require(`../../assets/json/ProfileCreationSuccess.json`)}
        autoPlay={true}
        loop={true}
        customLottieStyle={{
          height: screenRem * 12,
          width: screenRem * 12,
        }}
      />

      <VerticalSpace h={4} />

      <Text style={styles.heading}>Your profile has been created</Text>

      <VerticalSpace h={2} />

      <Text style={styles.subInfo}>
        Congrats on your new profile! Get ready to{`\n`}explore.
      </Text>

      <VerticalSpace h={4} />

      <Card
        heading={`Add Vehicle`}
        info={`Add your vehicle and find${`\n`}compatible chargers`}
      >
        <GREEN_CAR />
      </Card>

      <VerticalSpace h={2} />

      <Card
        heading={`Plan Your Trip`}
        info={`Plan your first trip and get on the${`\n`}road`}
      >
        <ROUTE />
      </Card>

      <VerticalSpace h={2} />

      <TextButton
        label={`Back to home`}
        customTextStyle={{
          color: THEME,
        }}
      />
    </SafeAreaView>
  );
};

export default ProfileCreationSuccess;

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: widthRem * 4,
    backgroundColor: WHITE,
  },
  heading: {
    fontFamily: BERTIOGASANS_BOLD,
    color: BLACK,
    fontSize: screenRem * 3.2,
    textAlign: "center",
  },
  subInfo: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.2,
    color: FLINT_STONE,
    lineHeight: screenRem * 2,
    textAlign: "center",
  },
});
