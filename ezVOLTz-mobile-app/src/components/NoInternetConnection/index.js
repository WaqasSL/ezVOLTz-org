import React from "react";
import { View, Image, Text } from "react-native";

import { screenRem } from "../../constants/dimensions";
import { WHITE } from "../../constants/colors";
import images from "../../constants/images";
import VerticalSpace from "../VerticalSpace";
import { BERTIOGASANS_REGULAR } from "../../constants/fonts";
import FastImage from "react-native-fast-image";

const NoInternetConnection = () => {
  return (
    <View
      style={{
        backgroundColor: WHITE,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FastImage
        source={images.noWifi}
        style={{ height: screenRem * 8, width: screenRem * 8 }}
        resizeMode={`contain`}
      />

      <VerticalSpace h={2} />

      <Text
        style={{
          fontFamily: BERTIOGASANS_REGULAR,
          fontSize: screenRem * 1.2,
        }}
      >
        No internet connection
      </Text>
    </View>
  );
};

export default NoInternetConnection;
