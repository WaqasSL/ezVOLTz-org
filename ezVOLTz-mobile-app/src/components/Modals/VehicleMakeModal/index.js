import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

import ModalWrapper from "../ModalWrapper";
import HorizontalSpace from "../../../components/HorizontalSpace";

import { make } from "../../../constants/miscellaneous";
import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../../constants/fonts";
import { BLACK, JASPER_CANE } from "../../../constants/colors";

const VehicleMakeModal = ({ data, isVisible, closeModal, label, leftIcon }) => {
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
            style={styles.makeContainer}
            onPress={() => closeModal(item)}
          >
            {item.icon}

            <HorizontalSpace w={4} />

            <Text style={styles.labelText}>{item.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </ModalWrapper>
  );
};

export default VehicleMakeModal;

const styles = StyleSheet.create({
  makeContainer: {
    paddingHorizontal: widthRem * 4,
    paddingVertical: heightRem * 2,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: JASPER_CANE,
  },
  labelText: {
    fontFamily:
      Platform.OS === "ios" ? BERTIOGASANS_REGULAR : BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.3,
    color: BLACK,
  },
});
