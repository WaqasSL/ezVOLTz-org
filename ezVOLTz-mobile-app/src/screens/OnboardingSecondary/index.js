import React, { useCallback } from "react";
import { SafeAreaView, View, Text, StyleSheet, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

import VerticalSpace from "../../components/VerticalSpace";
import TextButton from "../../components/Buttons/TextButton";
import HollowButton from "../../components/Buttons/HollowButton";
import SolidButton from "../../components/Buttons/SolidButton";

import {
  ONBOARDING_BG,
  EZVOLTZ_LOGO_PRIMARY,
  ONBOARDING_4,
} from "../../constants/svg";
import { BERTIOGASANS_BOLD, BERTIOGASANS_REGULAR } from "../../constants/fonts";
import { WHITE, FLINT_STONE, BLACK, THEME } from "../../constants/colors";
import { heightRem, screenRem, widthRem } from "../../constants/dimensions";

const OnboardingSecondary = () => {
  const navigation = useNavigation();

  const goToAccessAccount = useCallback(() => {
    navigation.navigate("AccessAccount");
  }, [navigation]);

  const goToCreateAccount = useCallback(() => {
    navigation.navigate("PersonalInformation");
  }, [navigation]);

  const goToHome = useCallback(() => {
    navigation.navigate("AppTabs");
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ONBOARDING_BG style={styles.onboardingBG} />

      <View style={styles.mainContainer}>
        <View style={styles.logoContainer}>
          <VerticalSpace h={2} />

          <EZVOLTZ_LOGO_PRIMARY />

          <VerticalSpace h={2} />
        </View>

        <View style={styles.detailsContainer}>
          <ONBOARDING_4 />

          <Text style={styles.headingText}>Get Started</Text>

          <VerticalSpace h={2} />

          <Text style={styles.infoText}>
            Create an account or login to start planning{`\n`}your trip!
          </Text>
        </View>

        <View style={styles.bottomContainer}>
          <SolidButton
            label={`Login`}
            size={`xl`}
            onPress={goToAccessAccount}
          />

          <VerticalSpace h={1} />

          <HollowButton
            label={`Create An Account`}
            size={`xl`}
            onPress={goToCreateAccount}
          />

          <VerticalSpace h={1} />

          <Text style={styles.infoText}>
            You can use some functions without logging in
          </Text>

          <VerticalSpace h={1} />

          <TextButton
            label={`Try Guest Mode`}
            customTextStyle={{ color: THEME }}
            onPress={goToHome}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingSecondary;

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  onboardingBG: {
    position: "absolute",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  logoContainer: { alignSelf: "center" },
  detailsContainer: {
    alignItems: "center",
  },
  headingText: {
    fontFamily: BERTIOGASANS_BOLD,
    fontSize: screenRem * 1.6,
    textAlign: "center",
    color: BLACK,
  },
  infoText: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.2,
    width: widthRem * 90,
    textAlign: "center",
    color: FLINT_STONE,
    lineHeight: screenRem * 2,
  },
  bottomContainer: {
    alignItems: "center",
    marginTop: heightRem * 4,
    marginBottom: Platform.OS === "ios" ? heightRem * 2 : heightRem * 4,
  },
});
