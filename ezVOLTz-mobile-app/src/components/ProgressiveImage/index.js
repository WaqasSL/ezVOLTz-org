import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Animated, Image } from "react-native";

const ProgressiveImage = ({ defaultImageSource, source, style, ...props }) => {
  const defaultImageAnimated = useRef(new Animated.Value(0)).current;
  const imageAnimated = useRef(new Animated.Value(0)).current;

  const handleDefaultImageLoad = () => {
    Animated.timing(defaultImageAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleImageLoad = () => {
    Animated.timing(imageAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        {...props}
        source={defaultImageSource}
        style={[style, { opacity: defaultImageAnimated }]}
        onLoad={handleDefaultImageLoad}
        blurRadius={1}
      />
      <Animated.Image
        {...props}
        source={source}
        style={[style, { opacity: imageAnimated }, styles.imageOverlay]}
        onLoad={handleImageLoad}
      />
    </View>
  );
};

export default ProgressiveImage;

const styles = StyleSheet.create({
  container: {},
  imageOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
