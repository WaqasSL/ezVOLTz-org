import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";

import HorizontalSpace from "../HorizontalSpace";

import { FLINT_STONE, PINBALL } from "../../constants/colors";
import {
  heightRem,
  screenRem,
  width,
  widthRem,
} from "../../constants/dimensions";
import { BERTIOGASANS_REGULAR } from "../../constants/fonts";
import { useDebounce } from "../../hooks/useDebounce";

const PickerPanel = ({ label, leftIcon, rightIcon, onPickerPanelPress }) => {
  const { debounce } = useDebounce();
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>{leftIcon}</View>

      <HorizontalSpace w={2} />

      <Pressable
        style={styles.rightContainer}
        onPress={() => debounce(onPickerPanelPress)}
      >
        <Text style={styles.placeholderText} numberOfLines={1}>
          {label}
        </Text>

        <Pressable>{rightIcon}</Pressable>
      </Pressable>
    </View>
  );
};

export default PickerPanel;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftContainer: {
    width: widthRem * 6,
    alignItems: "center",
  },
  rightContainer: {
    borderWidth: 1,
    flex: 1,
    borderColor: PINBALL,
    paddingHorizontal: widthRem * 4,
    paddingVertical: heightRem * 1.6,
    borderRadius: width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  placeholderText: {
    width: "90%",
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.1,
    color: FLINT_STONE,
  },
});
