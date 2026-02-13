import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
} from "react-native";

import ModalWrapper from "../ModalWrapper";
import VerticalSpace from "../../../components/VerticalSpace";

import { screenRem, widthRem } from "../../../constants/dimensions";
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../../constants/fonts";
import { BLACK, FLINT_STONE, JASPER_CANE } from "../../../constants/colors";
import images from "../../../constants/images";
import FastImage from "react-native-fast-image";

const VehicleModelModal = ({
  data,
  isVisible,
  closeModal,
  label,
  leftIcon,
}) => {
  return (
    <ModalWrapper
      isVisible={isVisible}
      closeModal={closeModal}
      label={label}
      leftIcon={leftIcon}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {data.map((item, index) => (
          <Pressable
            key={index}
            style={styles.modelContainer}
            onPress={() => closeModal(item)}
          >
            <View style={styles.leftContainer}>
              <Text style={styles.modelText}>{item.label}</Text>

              <VerticalSpace h={1} />

              <Text style={styles.rangeText}>{item.range} kWh</Text>
            </View>

            <View style={styles.rightContainer}>
              <FastImage
                source={images.vehicle}
                style={{
                  height: screenRem * 8,
                  width: screenRem * 10,
                }}
                resizeMode={"contain"}
              />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </ModalWrapper>
  );
};

export default VehicleModelModal;

const styles = StyleSheet.create({
  modelContainer: {
    paddingHorizontal: widthRem * 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: JASPER_CANE,
  },
  modelText: {
    fontFamily:
      Platform.OS === "ios" ? BERTIOGASANS_REGULAR : BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.4,
    width: `92%`,
    color: BLACK,
  },
  rangeText: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.2,
    color: FLINT_STONE,
  },
  leftContainer: { width: "66%" },
  rightContainer: {
    width: "34%",
    alignItems: "center",
    justifyContent: "center",
  },
});
