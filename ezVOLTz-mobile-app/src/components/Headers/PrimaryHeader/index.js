import { ArrowLeft } from "iconsax-react-native";
import React from "react";
import { Text, View, StyleSheet, Pressable, Platform } from "react-native";

import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";
import { BERTIOGASANS_SEMIBOLD } from "../../../constants/fonts";

const PrimaryHeader = ({
  label,
  displayBackButton,
  color,
  onBackButtonPress,
  children,
  labelStyles
}) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {displayBackButton && (
          <Pressable onPress={onBackButtonPress} style={styles.backButton}>
            <ArrowLeft size={screenRem * 1.8} color={color} />
          </Pressable>
        )}
        <Text style={[styles.label(color), labelStyles]}>{label}</Text>
      </View>

      {children}
    </View>
  );
};

export default PrimaryHeader;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: widthRem * 4,
    paddingVertical: heightRem * 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: (color) => ({
    fontFamily: BERTIOGASANS_SEMIBOLD,
    fontSize: screenRem * 1.3,
    color,

    bottom: Platform.OS === "android" ? heightRem * 0.2 : 0,
  }),
  backButton: {
    marginRight: widthRem * 2,
    padding: 6,
  },
});
