import { Setting4 } from "iconsax-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HorizontalSpace from "../../../components/HorizontalSpace";

import { BERTIOGASANS_REGULAR } from "../../../constants/fonts";
import {
  FLINT_STONE,
  THEME,
  WHITE,
  PINBALL,
  WILD_DOVE,
} from "../../../constants/colors";
import {
  heightRem,
  screenRem,
  width,
  widthRem,
} from "../../../constants/dimensions";
import { CLOSE_GREY } from "../../../assets/icons";

const HomeHeader = ({
  onTextInputPress,
  onFilterPress,
  label,
  onClearTextInput,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.mainContainer(insets)}>
      <Pressable onPress={onTextInputPress} style={styles.container(insets)}>
        <Text style={styles.locationText} numberOfLines={1}>
          {label}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {label !== `Search Location` && (
            <Pressable onPress={onClearTextInput} style={{ padding: 4 }}>
              <CLOSE_GREY />
            </Pressable>
          )}
          <HorizontalSpace w={2} />
        </View>
      </Pressable>
      <Pressable onPress={onFilterPress} style={styles.filterButton}>
        <Setting4 color={WHITE} size={screenRem * 1.4} />
      </Pressable>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  mainContainer: (insets) => ({
    width: widthRem * 100,
    position: "absolute",
    zIndex: 1,
    top: insets.top + heightRem * 2,
    alignSelf: "center",
    borderRadius: width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  }),
  container: (insets) => ({
    width: widthRem * 80,
    backgroundColor: WHITE,
    zIndex: 1,
    height: heightRem * 5,
    alignSelf: "center",
    paddingVertical: heightRem * 0.8,
    paddingRight: widthRem * 2,
    paddingLeft: widthRem * 4,
    borderRadius: width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: PINBALL,
  }),
  locationText: {
    color: FLINT_STONE,
    fontSize: screenRem * 1.1,
    fontFamily: BERTIOGASANS_REGULAR,
    width: "72%",
  },
  filterButton: {
    padding: screenRem * 0.6,
    backgroundColor: THEME,
    borderRadius: width,
  },
});
