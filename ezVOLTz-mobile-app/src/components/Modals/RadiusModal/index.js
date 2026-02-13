import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import VerticalSpace from "../../../components/VerticalSpace";
import SingleSelect from "../../../components/SingleSelect";

import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";
import { WHITE } from "../../../constants/colors";
import { CLOSE_GREY } from "../../../assets/icons";
import { BERTIOGASANS_MEDIUM } from "../../../constants/fonts";
import { radiusData } from "../../../constants/miscellaneous";

const RadiusModal = ({ isVisible, onCloseModal, label, getSelectedItem }) => {
  const insets = useSafeAreaInsets();
  const { filter } = useSelector((state) => state);

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

        <View style={styles.childContainer}>
          <SingleSelect
            data={radiusData}
            value={filter.radius}
            getSelectedItem={getSelectedItem}
          />
        </View>
      </View>
    </Modal>
  );
};

export default RadiusModal;

const styles = StyleSheet.create({
  modalContainer: { margin: 0, justifyContent: "flex-end" },
  container: (insets) => ({
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
  },
  childContainer: {
    paddingHorizontal: widthRem * 4,
    paddingBottom: heightRem * 4,
  },
});
