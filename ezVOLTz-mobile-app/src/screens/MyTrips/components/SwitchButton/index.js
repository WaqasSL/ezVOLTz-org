import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";

import { BERTIOGASANS_REGULAR } from "../../../../constants/fonts";
import { FLINT_STONE, THEME } from "../../../../constants/colors";
import {
  heightRem,
  screenRem,
  widthRem,
} from "../../../../constants/dimensions";

const SwitchButton = ({ activeSwitch, onPressButton }) => {

  const renderButton = (info) => {
    const isActive = activeSwitch === info;
    return (
      <Pressable
        style={
          isActive
            ? styles.activeButtonContainer
            : styles.inActiveButtonContainer
        }
        onPress={() => onPressButton(info)}
      >
        <Text
          style={isActive ? styles.activeButtonText : styles.inactiveButtonText}
        >
          {info}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {renderButton("Upcoming Trips")}
      {renderButton("Past Trips")}
    </View>
  );
};

export default SwitchButton;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: widthRem * 4,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  activeButtonContainer: {
    borderBottomColor: THEME,
    borderBottomWidth: 1,
    width: widthRem * 40,
    alignItems: "center",
    paddingTop: heightRem,
  },
  inActiveButtonContainer: {
    width: widthRem * 40,
    alignItems: "center",
    paddingTop: heightRem,
  },
  activeButtonText: {
    color: THEME,
    fontSize: screenRem * 1.3,
    fontFamily: BERTIOGASANS_REGULAR,
    paddingBottom: screenRem * 0.6,
  },
  inactiveButtonText: {
    color: FLINT_STONE,
    fontSize: screenRem * 1.3,
    fontFamily: BERTIOGASANS_REGULAR,
    paddingBottom: screenRem * 0.6,
  },
});
