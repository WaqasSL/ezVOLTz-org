import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

import HorizontalSpace from "../../../components/HorizontalSpace";
import VerticalSpace from "../../../components/VerticalSpace";

import {
  BLACK,
  FLINT_STONE,
  JASPER_CANE,
  WHITE,
} from "../../../constants/colors";
import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../../constants/fonts";
import { paymentCards } from "../../../constants/enum";
import FastImage from "react-native-fast-image";

const PaymentMethodCard = ({ data }) => {
  return (
    <View style={styles.container}>
      <FastImage
        source={paymentCards[data?.card?.brand]}
        style={styles.brandImage}
        resizeMode={"contain"}
      />

      <HorizontalSpace w={6} />

      <View>
        <Text style={styles.brandText}>{data?.card?.brand}</Text>

        <VerticalSpace h={2} />

        <Text style={styles.greyText}>**** **** **** {data?.card?.last4}</Text>

        <Text style={styles.greyText}>
          Exp - {data?.card?.exp_month}/{data?.card?.exp_year}
        </Text>
      </View>
    </View>
  );
};

export default PaymentMethodCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: widthRem * 6,
    backgroundColor: WHITE,
    borderColor: JASPER_CANE,
    borderWidth: 1,
    borderRadius: screenRem * 2,
    marginHorizontal: widthRem * 4,
    marginVertical: heightRem,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: heightRem * 2,
  },
  brandImage: {
    height: screenRem * 6,
    width: screenRem * 6,
  },
  brandText: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.6,
    color: BLACK,
    textTransform: "capitalize",
  },
  greyText: {
    fontSize: screenRem * 1.4,
    color: FLINT_STONE,
    fontFamily: BERTIOGASANS_REGULAR,
  },
});
