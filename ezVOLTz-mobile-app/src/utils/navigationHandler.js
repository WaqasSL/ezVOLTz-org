import * as React from "react";
import { StackActions } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}
export function goBack() {
  return navigationRef.current?.goBack();
}
export function replace(name, params) {
  navigationRef.current?.dispatch(StackActions.replace(name, params));
}
export function reset(name, params) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: name, params: params }],
    })
  );
}

export function getCurrentScreen() {
  return navigationRef?.current?.getCurrentRoute()?.name;
}
export function pop() {
  navigationRef.current?.dispatch(StackActions.pop());
}

export function isCurrentScreenVisible(routeName) {
  return routeName === navigationRef?.current?.getCurrentRoute()?.name;
}
