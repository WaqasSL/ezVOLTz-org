import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";
import { FLINT_STONE, WHITE } from "../../../constants/colors";
import { CLOSE_GREY } from "../../../assets/icons";
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../../constants/fonts";

const RangeHaloModal = ({ isVisible, label, closeModal }) => {
  const insets = useSafeAreaInsets();
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

          <Pressable style={styles.closeButton} onPress={closeModal}>
            <CLOSE_GREY height={screenRem * 1.2} width={screenRem * 1.2} />
          </Pressable>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Range Halo shows your suggested recharging stop on your trip based
            on your vehicle range. Select a charging station within the green
            Range Halo bubble.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default RangeHaloModal;

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
  infoContainer: {
    paddingHorizontal: widthRem * 4,
    paddingVertical: heightRem * 2,
  },
  infoText: {
    fontFamily: BERTIOGASANS_REGULAR,
    color: FLINT_STONE,
    lineHeight: heightRem * 2,
  },
  closeButton: { padding: 4 },
});
