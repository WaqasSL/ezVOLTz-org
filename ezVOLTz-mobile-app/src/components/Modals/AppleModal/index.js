import React from "react";
import { StyleSheet, Text, SafeAreaView, Pressable } from "react-native";
import { View } from "react-native";
import Modal from "react-native-modal";
import { Field, Formik } from "formik";

import VerticalSpace from "../../../components/VerticalSpace";
import PhoneTextInput from "../../../components/TextInputs/PhoneTextInput";
import SolidButton from "../../../components/Buttons/SolidButton";
import OutlineTextInput from "../../../components/TextInputs/OutlineTextInput";

import { mask } from "../../../constants/miscellaneous";
import {
  width,
  height,
  screenRem,
  widthRem,
} from "../../../constants/dimensions";
import { WHITE, FLINT_STONE, BLACK, BERN_RED } from "../../../constants/colors";
import {
  BERTIOGASANS_BOLD,
  BERTIOGASANS_REGULAR,
} from "../../../constants/fonts";
import { loginWithAppleSchema } from "../../../utils/schema";
import { CLOSE_GREY } from "../../../assets/icons";

const AppleModal = ({ isVisible, closeModal, onSubmit, initialValues }) => {
  return (
    <Modal isVisible={isVisible} style={styles.modalContainer} backdropTransitionOutTiming={0}>
      <SafeAreaView style={styles.safeAreaViewContainer}>
        <Pressable style={styles.closeButtonContainer} onPress={closeModal}>
          <CLOSE_GREY />
        </Pressable>

        <View style={styles.childContainer}>
          <Text style={styles.heading}>Missing Information</Text>

          <VerticalSpace h={2} />

          <Text style={styles.subInfo}>
            Fill out the following information in order to login with apple
          </Text>
        </View>

        <VerticalSpace h={4} />

        <Formik
          onSubmit={(values) => {
            onSubmit(values);
            closeModal();
          }}
          initialValues={initialValues}
          validateOnChange={true}
          validateOnBlur={true}
          validationSchema={loginWithAppleSchema}
        >
          {({ handleSubmit, handleChange, handleBlur, values }) => (
            <View style={styles.childContainer}>
              <Field name="name">
                {({ meta }) => (
                  <>
                    <OutlineTextInput
                      placeholder={`Full Name`}
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      value={values.name}
                    />

                    <VerticalSpace h={1} />

                    <Text style={styles.errorMessage}>
                      {meta.touched ? meta.error : null}
                    </Text>
                  </>
                )}
              </Field>

              <VerticalSpace h={1} />

              <Field name="email">
                {({ meta }) => (
                  <>
                    <OutlineTextInput
                      placeholder={`Enter Email`}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                    />

                    <VerticalSpace h={1} />

                    <Text style={styles.errorMessage}>
                      {meta.touched ? meta.error : null}
                    </Text>
                  </>
                )}
              </Field>

              <VerticalSpace h={1} />

              <Field name="phone">
                {({ meta }) => (
                  <>
                    <PhoneTextInput
                      mask={mask}
                      name="phone"
                      placeholder="| Phone Number"
                      keyboardType="numeric"
                      value={values.phone}
                    />

                    <VerticalSpace h={1} />

                    <Text style={styles.errorMessage}>
                      {meta.touched ? meta.error : null}
                    </Text>
                  </>
                )}
              </Field>

              <VerticalSpace h={2} />

              <SolidButton label={`Submit`} onPress={handleSubmit} />
            </View>
          )}
        </Formik>
      </SafeAreaView>
    </Modal>
  );
};

export default AppleModal;

const styles = StyleSheet.create({
  modalContainer: { margin: 0 },
  safeAreaViewContainer: {
    width,
    height,
    backgroundColor: WHITE,
  },
  childContainer: {
    paddingHorizontal: widthRem * 4,
  },
  heading: {
    fontFamily: BERTIOGASANS_BOLD,
    color: BLACK,
    fontSize: screenRem * 3.2,
  },
  subInfo: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.2,
    color: FLINT_STONE,
    lineHeight: screenRem * 2,
  },
  closeButtonContainer: {
    alignSelf: "flex-end",
    padding: 4,
    marginRight: widthRem * 4
  },
  errorMessage: {
    color: BERN_RED,
    fontSize: screenRem,
    fontFamily: BERTIOGASANS_REGULAR,
    marginLeft: widthRem * 6,
  },
});
