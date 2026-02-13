import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import VerticalSpace from "../../../components/VerticalSpace";
import SolidButton from "../../../components/Buttons/SolidButton";
import HollowButton from "../../../components/Buttons/HollowButton";
import HorizontalSpace from "../../../components/HorizontalSpace";

import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";
import { FLINT_STONE, WHITE } from "../../../constants/colors";
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../../constants/fonts";
import { CLOSE_GREY } from "../../../assets/icons";

const DecisionModal = ({
  isVisible,
  label,
  message,
  onCloseModalPress,
  leftButtonText,
  rightButtonText,
  leftButtonPress,
  rightButtonPress,
  displayCloseButton,
}) => {
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

          {displayCloseButton && (
            <Pressable
              onPress={onCloseModalPress}
              style={{
                padding: 4,
              }}
            >
              <CLOSE_GREY />
            </Pressable>
          )}
        </View>

        <VerticalSpace h={2} />

        <View style={styles.childContainer}>
          <Text style={styles.messageText}>{message}</Text>

          <VerticalSpace h={4} />

          <View style={styles.buttonsContainer}>
            <HollowButton
              size={`md`}
              label={leftButtonText}
              onPress={leftButtonPress}
              customTextStyle={{ fontSize: screenRem }}
            />

            <HorizontalSpace w={6} />

            <SolidButton
              size={`md`}
              label={rightButtonText}
              onPress={rightButtonPress}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DecisionModal;

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
    fontSize: screenRem * 1.3,
    fontFamily: BERTIOGASANS_MEDIUM,
  },
  childContainer: {
    paddingHorizontal: widthRem * 4,
    paddingBottom: heightRem * 4,
  },
  messageText: {
    fontFamily: BERTIOGASANS_REGULAR,
    color: FLINT_STONE,
    lineHeight: screenRem * 1.6,
    fontSize: screenRem * 1.2,
    marginLeft: widthRem * 2,
  },
  buttonsContainer: { flexDirection: "row", alignSelf: "center" },
});
