import React from "react";
import { View, StyleSheet } from "react-native";

import { JASPER_CANE } from "../../constants/colors";

const Line = () => {
  return <View style={styles.line} />;
};

export default Line;

const styles = StyleSheet.create({
  line: {
    borderBottomWidth: 1,
    borderBottomColor: JASPER_CANE,
  },
});
