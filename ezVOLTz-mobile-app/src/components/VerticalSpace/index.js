import React from "react";
import { View } from "react-native";

import { heightRem } from "../../constants/dimensions";

const VerticalSpace = ({ h }) => {
  return (
    <View
      style={{
        height: heightRem * h,
      }}
    />
  );
};

export default VerticalSpace;
