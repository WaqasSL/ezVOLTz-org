import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { Copy, Edit, Trash } from "iconsax-react-native";

import HorizontalSpace from "../../../../components/HorizontalSpace";

import {
  BERN_RED,
  JASPER_CANE,
  THEME,
  WHITE,
} from "../../../../constants/colors";
import {
  heightRem,
  screenRem,
  widthRem,
} from "../../../../constants/dimensions";

const SwipeItem = ({ onDeletePress, onAdjustPress, activeSwitch }) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={{
          ...styles.buttonContainer,
          backgroundColor: THEME,
        }}
        onPress={onAdjustPress}
      >
        {activeSwitch === "Upcoming Trips" ? (
          <Edit size={screenRem * 1.2} color={WHITE} />
        ) : (
          <Copy size={screenRem * 1.2} color={WHITE} />
        )}
      </Pressable>

      <HorizontalSpace w={2} />

      <Pressable
        style={{
          ...styles.buttonContainer,
          backgroundColor: BERN_RED,
        }}
        onPress={onDeletePress}
      >
        <Trash size={screenRem * 1.2} color={WHITE} />
      </Pressable>
    </View>
  );
};

export default SwipeItem;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    width: widthRem * 92,
    paddingHorizontal: widthRem * 6,
    paddingVertical: heightRem * 2,
    backgroundColor: JASPER_CANE,
    borderRadius: screenRem * 2,
    marginHorizontal: widthRem * 4,
    marginVertical: heightRem,
  },
  buttonContainer: {
    height: screenRem * 3,
    width: screenRem * 3,
    borderRadius: screenRem * 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
