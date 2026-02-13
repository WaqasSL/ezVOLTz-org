import React from "react";
import { View, StyleSheet } from "react-native";
import { SkypeIndicator } from "react-native-indicators";

import { width, height } from "../../constants/dimensions";
import { THEME, WHITE } from "../../constants/colors";

const Loader = () => {
  return (
    <View style={styles.container}>
      <SkypeIndicator color={THEME} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1,
    width,
    height,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.4,
  },
});
