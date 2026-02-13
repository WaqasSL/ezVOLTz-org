import React from "react";
import { Image } from "react-native";
import FastImage from "react-native-fast-image";

import { height, width } from "../../constants/dimensions";

const Gif = () => {
  return (
    <FastImage
      source={require(`../../assets/gif/splash_gif.gif`)}
      style={{ height, width }}
      resizeMode={`stretch`}
    />
  );
};

export default Gif;
