import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";

import VerticalSpace from "../../../components/VerticalSpace";

import {
  BLACK,
  FLINT_STONE,
  JASPER_CANE,
  WHITE,
} from "../../../constants/colors";
import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";
import {
  BERTIOGASANS_REGULAR,
  BERTIOGASANS_SEMIBOLD,
} from "../../../constants/fonts";
import images from "../../../constants/images";

const VehicleListCard = ({ data }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Text style={styles.boldText}>{data?.model?.model}</Text>

        <VerticalSpace h={2} />

        <View style={styles.rowContainer}>
          <Text style={styles.leftText}>
            Make:{" "}
            <Text style={styles.boldText}>{data?.make?.name || `N/A`}</Text>
          </Text>
        </View>

        <VerticalSpace h={1} />

        <View style={styles.rowContainer}>
          <Text style={styles.leftText}>
            Range: <Text style={styles.boldText}>{data?.range} kWh</Text>
          </Text>
        </View>
      </View>

      <View style={styles.rightContainer}>
        <FastImage
          source={images.vehicle}
          style={styles.vehicleImage}
          resizeMode={"contain"}
        />
      </View>
    </View>
  );
};

export default VehicleListCard;

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
    justifyContent: "space-between",
  },
  rowContainer: {
    alignItems: "center",
    flexWrap: "wrap",
    width: "88%",
  },
  boldText: {
    fontFamily: BERTIOGASANS_SEMIBOLD,
    fontSize: screenRem * 1.2,
    color: BLACK,
    lineHeight: heightRem * 2,
  },
  leftText: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.1,
    color: FLINT_STONE,
    lineHeight: heightRem * 2,
  },
  vehicleImage: {
    height: screenRem * 12,
    width: screenRem * 12,
  },
  leftContainer: { width: "60%" },
  rightContainer: { width: "40%", alignItems: "flex-end" },
});
