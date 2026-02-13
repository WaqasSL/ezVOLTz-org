import React from "react";
import { StyleSheet, SafeAreaView, Pressable, View, Text } from "react-native";
import Modal from "react-native-modal";

import VerticalSpace from "../../../components/VerticalSpace";

import {
  width,
  height,
  screenRem,
  widthRem,
  heightRem,
} from "../../../constants/dimensions";
import { BLACK, WHITE } from "../../../constants/colors";
import { BERTIOGASANS_SEMIBOLD } from "../../../constants/fonts";
import { CLOSE_GREY } from "../../../assets/icons";

const ModalWrapper = ({
  leftIcon,
  displayCloseButton,
  closeModal,
  label,
  children,
  ...props
}) => {
  return (
    <Modal
      {...props}
      style={styles.modalContainer}
      backdropTransitionOutTiming={0}
    >
      <SafeAreaView style={styles.safeAreaViewContainer}>
        <VerticalSpace h={2} />
        <View style={styles.headerContainer(displayCloseButton)}>
          {leftIcon}

          <Text style={styles.headingText}>{label}</Text>

          {displayCloseButton && (
            <Pressable onPress={closeModal} style={{ padding: 4 }}>
              <CLOSE_GREY />
            </Pressable>
          )}
        </View>

        <VerticalSpace h={2} />

        {children}
      </SafeAreaView>
    </Modal>
  );
};

export default ModalWrapper;

const styles = StyleSheet.create({
  modalContainer: { margin: 0 },
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  headerContainer: (displayCloseButton) => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: displayCloseButton ? "space-between" : null,
    paddingHorizontal: widthRem * 4,
    paddingTop: heightRem,
  }),
  headingText: {
    fontFamily: BERTIOGASANS_SEMIBOLD,
    fontSize: screenRem * 1.3,
    textTransform: "capitalize",
    color: BLACK,
  },
});
