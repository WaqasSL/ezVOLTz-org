import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import PrimaryHeader from "../../components/Headers/PrimaryHeader";
import VerticalSpace from "../../components/VerticalSpace";

import { BLACK, FLINT_STONE, THEME, WHITE } from "../../constants/colors";
import {
  EZVOLTZ_LOGO_SECONDARY,
  EZVOLTZ_LOGO_PRIMARY,
} from "../../constants/svg";
import { BERTIOGASANS_MEDIUM } from "../../constants/fonts";
import { screenRem } from "../../constants/dimensions";

const AppInfo = () => {
  const navigation = useNavigation();

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: WHITE }}>
      <PrimaryHeader
        label={`App Info`}
        color={BLACK}
        displayBackButton={true}
        onBackButtonPress={goBack}
      />

      <View style={styles.childContainer}>
        <Text style={styles.ezvoltzText}>ezVOLTz</Text>

        <VerticalSpace h={1} />

        <Text style={styles.versionText}>Version 1.0.0(42)</Text>

        <VerticalSpace h={4} />

        <EZVOLTZ_LOGO_PRIMARY />

        <VerticalSpace h={4} />

        <Text style={styles.copyrightText}>
          Copyright {new Date().getFullYear()} ezVOLTz
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AppInfo;

const styles = StyleSheet.create({
  childContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  ezvoltzText: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.6,
    color: THEME,
  },
  versionText: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.4,
    color: FLINT_STONE,
  },
  copyrightText: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.2,
    color: FLINT_STONE,
  },
});
