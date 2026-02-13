import React from "react";
import LottieView from "lottie-react-native";

const LottieAnimationView = ({ source, customLottieStyle, autoPlay, loop }) => {
  return (
    <LottieView
      source={source}
      style={customLottieStyle}
      autoPlay={autoPlay}
      loop={loop}
    />
  );
};

export default LottieAnimationView;
