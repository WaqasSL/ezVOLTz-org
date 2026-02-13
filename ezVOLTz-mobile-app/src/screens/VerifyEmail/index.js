import React, { useCallback } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import VerticalSpace from "../../components/VerticalSpace";
import SolidButton from "../../components/Buttons/SolidButton";
import RoundBackButton from "../../components/Buttons/RoundBackButton";

import { screenRem, widthRem } from "../../constants/dimensions";
import { BERTIOGASANS_BOLD, BERTIOGASANS_REGULAR } from "../../constants/fonts";
import { BERN_RED, BLACK, FLINT_STONE, THEME, WHITE } from "../../constants/colors";

const VerifyEmail = () => {
  const navigation = useNavigation();

  const goToAccessAccount = useCallback(() => {
    navigation.navigate("AccessAccount");
  }, [navigation]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <View style={styles.childContainer}>
        <VerticalSpace h={1} />

        <RoundBackButton onPress={goBack} />

        <VerticalSpace h={2} />

        <Text style={styles.heading}>Thanks For{`\n`}Joining Us</Text>

        <VerticalSpace h={2} />

        <Text style={styles.subInfo}>
          We'll occasionally send you emails with helpful information, updates, and exclusive offers. If you prefer not to receive these emails, you can easily opt out by adjusting your email notification settings after registration.
        </Text>

        <VerticalSpace h={2} />


        <Text style={styles.verifyEmailText}>*Please verify your email in order to continue.</Text>

        <VerticalSpace h={4} />

        <SolidButton label={`Go To Login`} onPress={goToAccessAccount} />
      </View>
    </SafeAreaView>
  );
};

export default VerifyEmail;

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  childContainer: { paddingHorizontal: widthRem * 4 },
  heading: {
    fontFamily: BERTIOGASANS_BOLD,
    color: BLACK,
    fontSize: screenRem * 3.2,
    lineHeight: screenRem * 4,
  },
  subInfo: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.2,
    color: FLINT_STONE,
    lineHeight: screenRem * 2,
  },
  verifyEmailText: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem,
    color: THEME,
  },
});
