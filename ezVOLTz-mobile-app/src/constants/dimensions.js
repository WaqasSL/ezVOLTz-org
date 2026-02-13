import { Dimensions } from "react-native";

export const { width, height } = Dimensions.get("window");

export const widthRem = width / 100;
export const heightRem = height / 100;

export const screenRem = widthRem + heightRem;
