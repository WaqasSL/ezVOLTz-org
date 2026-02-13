import React, { memo } from "react";
import { Platform, Pressable } from "react-native";
import { Marker } from "react-native-maps";

import { markerType } from "../../constants/enum";

const CustomMarker = ({ coordinate, onPress, zIndex, type }) => {
  return (
    <Marker
      tracksViewChanges={Platform.OS === "android" ? false : true}
      coordinate={coordinate}
      onPress={onPress}
      zIndex={zIndex}
    >
      {markerType[type]}
    </Marker>
  );
};

export default CustomMarker;
