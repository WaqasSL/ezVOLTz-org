import React from "react";
import { View } from "react-native";

import { screenRem } from "../../constants/dimensions";

const Circle = () => {
  return (
    <View
      style={{
        height: screenRem * 0.8,
        width: screenRem * 0.8,
        borderRadius: screenRem,
        borderWidth: 1,
      }}
    />
  );
};

export default Circle;
