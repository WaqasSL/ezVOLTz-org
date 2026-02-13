import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Add, Edit2, Refresh } from "iconsax-react-native";

import VerticalSpace from "../../../components/VerticalSpace";
import HorizontalSpace from "../../../components/HorizontalSpace";

import {
  WHITE_SMOKE,
  FLINT_STONE,
  THEME,
  BLACK,
} from "../../../constants/colors";
import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";
import {
  BERTIOGASANS_REGULAR,
  BERTIOGASANS_SEMIBOLD,
} from "../../../constants/fonts";
import images from "../../../constants/images";
import FastImage from "react-native-fast-image";

const VehicleCard = ({
  data,
  displayActionButton,
  onAddVehiclePress,
  onEditVehiclePress,
  onChangeVehiclePress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Text style={{ ...styles.boldText, width: widthRem * 50 }}>
          {data?.model?.model || data?.make?.models?.[0]?.model}
        </Text>

        <VerticalSpace h={1.2} />

        <View style={styles.textContainer}>
          <Text style={styles.leftText}>Make: </Text>
          <Text style={{ ...styles.boldText, width: widthRem * 36 }}>
            {data?.make?.name || data?.make?.make}
          </Text>
        </View>

        <VerticalSpace h={1.2} />

        <View style={styles.textContainer}>
          <Text style={styles.leftText}>Range: </Text>
          <Text style={{ ...styles.boldText, width: widthRem * 34 }}>
            {data?.range || data?.make?.models?.[0]?.range}
          </Text>
        </View>
        {displayActionButton && (
          <>
            <VerticalSpace h={1.4} />

            <View style={styles.actionButtonsContainer}>
              <Pressable
                style={styles.actionButton}
                onPress={onEditVehiclePress}
              >
                <Edit2 size={screenRem * 1.4} color={THEME} />
              </Pressable>

              <HorizontalSpace w={2} />

              <Pressable
                style={styles.actionButton}
                onPress={onChangeVehiclePress}
              >
                <Refresh size={screenRem * 1.4} color={THEME} />
              </Pressable>

              <HorizontalSpace w={2} />

              <Pressable
                style={styles.actionButton}
                onPress={onAddVehiclePress}
              >
                <Add size={screenRem * 1.4} color={THEME} />
              </Pressable>
            </View>
          </>
        )}
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

export default VehicleCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE_SMOKE,
    width: widthRem * 92,
    borderRadius: screenRem,
    paddingHorizontal: widthRem * 4,
    paddingVertical: heightRem * 2,
    flexDirection: "row",
  },
  leftContainer: {
    width: "60%",
  },
  boldText: {
    fontFamily: BERTIOGASANS_SEMIBOLD,
    fontSize: screenRem * 1.2,
    width: widthRem * 40,
    lineHeight: 18,
    fontSize: screenRem * 1.3,
    color: BLACK,
  },
  textContainer: {
    flexDirection: "row",
  },
  leftText: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.1,
    color: FLINT_STONE,
  },
  rightContainer: {
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleImage: {
    height: screenRem * 6,
    width: screenRem * 10,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    height: screenRem * 3,
    width: screenRem * 3,
    borderRadius: screenRem * 1.5,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: THEME,
  },
});
