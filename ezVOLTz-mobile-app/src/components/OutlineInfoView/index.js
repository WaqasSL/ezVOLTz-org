import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

import { BERTIOGASANS_REGULAR } from "../../constants/fonts";
import { BLACK, PINBALL, TROLLEY_GREY, WHITE } from "../../constants/colors";
import {
  heightRem,
  screenRem,
  width,
  widthRem,
} from "../../constants/dimensions";

const OutlineInfoView = ({ onPress, label, value, right, valueTextStyles }) => {
  const [labelHeight, setLabelHeight] = useState(0);

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View
        style={styles.labelContainer(labelHeight)}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setLabelHeight(height);
        }}
      >
        <Text style={styles.labelText}>{label}</Text>
      </View>

      <Text style={[styles.valueText, valueTextStyles]}>{value}</Text>

      {right}
    </Pressable>
  );
};

export default OutlineInfoView;

const styles = StyleSheet.create({
  container: {
    width: widthRem * 92,
    borderWidth: 1,
    borderRadius: width,
    paddingHorizontal: widthRem * 6,
    height: heightRem * 5,
    borderColor: PINBALL,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  labelContainer: (labelHeight) => ({
    position: "absolute",
    left: widthRem * 5,
    top: -labelHeight / 2,
    backgroundColor: WHITE,
  }),
  labelText: {
    fontSize: screenRem,
    color: TROLLEY_GREY,
    paddingHorizontal: widthRem,
  },
  valueText: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.2,
    color: BLACK,
  },
});
