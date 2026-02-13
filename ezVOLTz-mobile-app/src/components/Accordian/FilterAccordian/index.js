import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ArrowDown2, ArrowRight2 } from "iconsax-react-native";
import { BLACK, FLINT_STONE } from "../../../constants/colors";
import { screenRem } from "../../../constants/dimensions";
import { BERTIOGASANS_MEDIUM } from "../../../constants/fonts";

export default function FilterAccordian({ isVisible, label, hint, onPress }) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.sectionHeadingText}>
        {label}{" "}
        {hint && (
          <Text style={{ fontSize: screenRem, color: FLINT_STONE }}>
            {hint}
          </Text>
        )}
      </Text>
      {isVisible ? (
        <ArrowDown2 color={BLACK} size={screenRem * 2} />
      ) : (
        <ArrowRight2 color={BLACK} size={screenRem * 2} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sectionHeadingText: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.3,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
