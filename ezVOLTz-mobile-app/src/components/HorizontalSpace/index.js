import React from "react";
import { View } from "react-native";

import { widthRem } from "../../constants/dimensions";

const HorizontalSpace = ({ w }) => {
  return (
    <View
      style={{
        width: widthRem * w,
      }}
    />
  );
};

export default HorizontalSpace;
