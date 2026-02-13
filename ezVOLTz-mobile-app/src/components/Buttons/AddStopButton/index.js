import { ArrowSwapVertical } from "iconsax-react-native";
import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

import { BLACK, THEME } from "../../../constants/colors";
import { screenRem } from "../../../constants/dimensions";
import { BERTIOGASANS_REGULAR } from "../../../constants/fonts";

const AddStopButton = ({ onSwapPress, onAddStopPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.arrowSwapVerticalContainer}
        onPress={onSwapPress}
      >
        <ArrowSwapVertical size={screenRem * 1.6} color={BLACK} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onAddStopPress}>
        <Text style={styles.addStopText}>+Add stop</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddStopButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrowSwapVerticalContainer: {
    flex: 1,
    alignItems: "center",
  },
  addStopText: {
    fontFamily: BERTIOGASANS_REGULAR,
    color: THEME,
    fontSize: screenRem * 1.2,
  },
});
