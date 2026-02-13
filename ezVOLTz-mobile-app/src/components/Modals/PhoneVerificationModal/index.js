import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SolidButton from "../../../components/Buttons/SolidButton";
import VerticalSpace from "../../../components/VerticalSpace";

import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";
import {
  FLINT_STONE,
  JASPER_CANE,
  WHITE,
  WILD_DOVE,
} from "../../../constants/colors";
import { CLOSE_GREY } from "../../../assets/icons";
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../../constants/fonts";
import { showSnackDanger } from "../../../utils/functions";

const PhoneVerificationModal = ({
  isVisible,
  onCloseModal,
  label,
  getVerificationCode,
}) => {
  const insets = useSafeAreaInsets();

  const [code, setCode] = useState(``);

  const handleVerify = () => {
    Keyboard.dismiss();

    if (code === ``) {
      showSnackDanger(`Please enter 6 digit verification code`);
      return;
    }

    getVerificationCode(code);
  };

  return (
    <Modal
      isVisible={isVisible}
      style={styles.modalContainer}
      propagateSwipe={true}
      backdropTransitionOutTiming={0}
    >
      <KeyboardAvoidingView behavior="position" enabled>
        <View style={styles.container(insets)}>
          <View style={styles.headerContainer}>
            <Text style={styles.headingText}>{label}</Text>

            <Pressable onPress={onCloseModal} style={{ padding: 4 }}>
              <CLOSE_GREY height={screenRem * 1.2} width={screenRem * 1.2} />
            </Pressable>
          </View>

          <View style={styles.childContainer}>
            <VerticalSpace h={2} />

            <TextInput
              placeholder="Enter verification code"
              style={styles.textInput}
              keyboardType={"number-pad"}
              maxLength={6}
              value={code}
              onChangeText={(val) => setCode(val)}
            />

            <VerticalSpace h={2} />

            <SolidButton label={`Verify`} onPress={handleVerify} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default PhoneVerificationModal;

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
  textInput: {
    borderBottomWidth: 1,
    paddingBottom: heightRem,
    borderBottomColor: JASPER_CANE,
    fontFamily: BERTIOGASANS_REGULAR,
  },
});
