import React, { useCallback, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, Keyboard } from "react-native";
import { Field, Formik } from "formik";
import { useNavigation } from "@react-navigation/native";

import OutlineTextInput from "../../components/TextInputs/OutlineTextInput";
import VerticalSpace from "../../components/VerticalSpace";
import Loader from "../../components/Loader";
import SolidButton from "../../components/Buttons/SolidButton";
import RoundBackButton from "../../components/Buttons/RoundBackButton";

import { screenRem, widthRem } from "../../constants/dimensions";
import { BERTIOGASANS_BOLD, BERTIOGASANS_REGULAR } from "../../constants/fonts";
import { forgotPasswordSchema } from "../../utils/schema";
import useApiHook from "../../hooks/rest/useApi";
import { BERN_RED, BLACK, FLINT_STONE, WHITE } from "../../constants/colors";
import { showSnackSuccess } from "../../utils/functions";

const ForgotPassword = () => {
  const formikRef = useRef();
  const { handleRestApi, restApiLoading } = useApiHook();
  const navigation = useNavigation();

  const [forgotPasswordValues] = useState({
    email: "",
  });

  const submitForm = async (values) => {
    Keyboard.dismiss();

    const data = { ...values };

    const response = await handleRestApi({
      method: "post",
      url: `forgot-password`,
      data,
      headers: { Authorization: "none" },
    });

    if (response?.status === 200) {
      showSnackSuccess(response?.data?.message);

      const timer = setTimeout(() => {
        goBack();
        formikRef.current?.resetForm();
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }
  };

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      {restApiLoading && <Loader />}

      <View style={styles.childContainer}>
        <VerticalSpace h={1} />

        <RoundBackButton onPress={goBack} />

        <VerticalSpace h={2} />

        <Text style={styles.heading}>Forgot your{`\n`}password?</Text>

        <VerticalSpace h={2} />

        <Text style={styles.subInfo}>
          You will receive an email to reset your password
        </Text>

        <VerticalSpace h={4} />

        <Formik
          innerRef={formikRef}
          validateOnChange={true}
          validateOnBlur={true}
          onSubmit={submitForm}
          initialValues={forgotPasswordValues}
          validationSchema={forgotPasswordSchema}
          enableReinitialize={true}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => {
            return (
              <>
                <Field name={`email`}>
                  {({ meta }) => (
                    <>
                      <OutlineTextInput
                        placeholder={`Email`}
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

                <SolidButton label={`Send Email`} onPress={handleSubmit} />
              </>
            );
          }}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  childContainer: { paddingHorizontal: widthRem * 4 },
  heading: {
    fontFamily: BERTIOGASANS_BOLD,
    color: BLACK,
    fontSize: screenRem * 2.8,
  },
  subInfo: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.2,
    color: FLINT_STONE,
    lineHeight: screenRem * 2,
  },
  errorMessage: {
    color: BERN_RED,
    fontSize: screenRem,
    fontFamily: BERTIOGASANS_REGULAR,
    marginLeft: widthRem * 6,
  },
});
