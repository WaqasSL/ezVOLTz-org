import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowRight2 } from "iconsax-react-native";

import HorizontalSpace from "../../../components/HorizontalSpace";

import {
  heightRem,
  screenRem,
  width,
  widthRem,
} from "../../../constants/dimensions";
import {
  BLACK,
  FLINT_STONE,
  FLINT_STONE_LIGHT,
  WHITE_SMOKE,
  WILD_DOVE,
} from "../../../constants/colors";
import { BERTIOGASANS_REGULAR } from "../../../constants/fonts";

const MenuCard = ({
  icon,
  label,
  loginRequired,
  onPress,
  disabled,
  beforeRight,
}) => {
  return (
    <Pressable style={styles.container} onPress={onPress} disabled={disabled}>
      <View style={styles.leftContainer}>
        {icon}

        <HorizontalSpace w={4} />

        <Text
          style={{
            ...styles.label,
            color: loginRequired ? FLINT_STONE_LIGHT : FLINT_STONE,
          }}
        >
          {label}
        </Text>
      </View>

      {loginRequired ? (
        <View style={styles.loginRequiredContainer}>
          <Text style={styles.loginRequiredText}>Login Required</Text>
        </View>
      ) : (
        <View style={styles.rightContainer}>
          {beforeRight}
          <ArrowRight2 color={FLINT_STONE} size={screenRem * 1.6} />
        </View>
      )}
    </Pressable>
  );
};

export default MenuCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: heightRem * 1.4,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.3,
    color: BLACK,
  },
  loginRequiredContainer: {
    backgroundColor: WHITE_SMOKE,
    paddingHorizontal: widthRem * 4,
    paddingVertical: heightRem,
    borderRadius: width,
  },
  loginRequiredText: {
    color: WILD_DOVE,
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: 8,
  },
  rightContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
