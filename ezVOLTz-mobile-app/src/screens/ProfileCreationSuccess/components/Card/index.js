import React from "react";
import { StyleSheet, View, Text } from "react-native";

import HorizontalSpace from "../../../../components/HorizontalSpace";
import VerticalSpace from "../../../../components/VerticalSpace";

import { BLACK, WHITE_SMOKE, WILD_DOVE } from "../../../../constants/colors";
import {
  heightRem,
  screenRem,
  widthRem,
} from "../../../../constants/dimensions";
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../../../constants/fonts";

const Card = ({ heading, info, children }) => {
  return (
    <View style={styles.cardContainer}>
      {children}

      <HorizontalSpace w={4} />

      <View>
        <Text style={styles.heading}>{heading}</Text>

        <VerticalSpace h={1} />

        <Text style={styles.info}>{info}</Text>
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE_SMOKE,
    paddingVertical: heightRem * 2,
    width: widthRem * 92,
    borderRadius: screenRem * 1.2,
    paddingLeft: widthRem * 6,
  },
  heading: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.3,
    color: BLACK,
  },
  info: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.2,
    color: WILD_DOVE,
  },
});
