import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TickCircle } from "iconsax-react-native";

import VerticalSpace from "../../../components/VerticalSpace";
import HorizontalSpace from "../../../components/HorizontalSpace";

import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";
import {
  BLACK,
  FLINT_STONE,
  JASPER_CANE,
  PINBALL,
  THEME,
  WHITE,
} from "../../../constants/colors";
import { CLOSE_GREY } from "../../../assets/icons";
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../../constants/fonts";
import images from "../../../constants/images";
import FastImage from "react-native-fast-image";

const ChangeVehicleModal = ({
  data,
  isVisible,
  onCloseModal,
  getSelectedItem,
  label,
  value,
}) => {
  const insets = useSafeAreaInsets();

  const handleSelectedItem = (index) => {
    getSelectedItem(data[index]);
    onCloseModal();
  };

  return (
    <Modal
      isVisible={isVisible}
      style={styles.modalContainer}
      propagateSwipe={true}
      backdropTransitionOutTiming={0}
    >
      <View style={styles.container(insets)}>
        <View style={styles.headerContainer}>
          <Text style={styles.headingText}>{label}</Text>

          <Pressable onPress={onCloseModal} style={{ padding: 4 }}>
            <CLOSE_GREY height={screenRem * 1.2} width={screenRem * 1.2} />
          </Pressable>
        </View>

        <VerticalSpace h={2} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {data.map((item, index) => (
            <Pressable
              key={index}
              style={styles.dropdownItem}
              onPress={() => handleSelectedItem(index)}
            >
              <View style={styles.rowContainer}>
                <TickCircle
                  size={screenRem * 1.4}
                  color={value?._id === item?._id ? THEME : PINBALL}
                  variant={"Bold"}
                />

                <HorizontalSpace w={4} />

                <View>
                  <Text style={styles.modelText} numberOfLines={2}>
                    {item?.model?.model}
                  </Text>

                  <VerticalSpace h={1} />

                  <View style={styles.rowContainer}>
                    <Text style={styles.greyText}>{item?.make?.name}</Text>

                    <HorizontalSpace w={4} />

                    <Text style={styles.greyText}>{item?.range} kWh</Text>
                  </View>
                </View>
              </View>

              <FastImage
                source={images.vehicle}
                style={styles.vehicleImage}
                resizeMode={"contain"}
              />
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default ChangeVehicleModal;

const styles = StyleSheet.create({
  modalContainer: { margin: 0, justifyContent: "flex-end" },
  container: (insets) => ({
    flex: 0.4,
    backgroundColor: WHITE,
    justifyContent: "flex-end",
    paddingBottom: insets.bottom,
    paddingTop: heightRem * 2,
    borderTopLeftRadius: screenRem * 2,
    borderTopRightRadius: screenRem * 2,
  }),
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: widthRem * 6,
    paddingVertical: heightRem,
  },
  headingText: {
    fontSize: screenRem * 1.4,
    fontFamily: BERTIOGASANS_MEDIUM,
    color: BLACK,
  },
  dropdownItem: {
    paddingHorizontal: widthRem * 4,
    borderBottomWidth: 1,
    borderBottomColor: JASPER_CANE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: WHITE,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modelText: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.3,
    width: widthRem * 42,
    lineHeight: 20,
    color: BLACK,
  },
  greyText: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.2,
    color: FLINT_STONE,
  },
  vehicleImage: {
    height: screenRem * 10,
    width: screenRem * 10,
  },
});
