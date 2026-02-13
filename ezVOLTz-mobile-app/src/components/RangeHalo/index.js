import React from "react";
import { Circle } from "react-native-maps";

import { FRIENDLY_BASILISK, THEME } from "../../constants/colors";

const RangeHalo = ({ coords, radius }) => (
  <Circle
    center={coords}
    radius={radius}
    fillColor={FRIENDLY_BASILISK}
    strokeColor={THEME}
    strokeWidth={2}
  />
);

export default RangeHalo;
