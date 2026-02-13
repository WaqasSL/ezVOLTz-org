import React, { useCallback, useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Platform,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import { Field, Formik } from "formik";
import { useNavigation } from "@react-navigation/native";

import OutlineTextInput from "../../components/TextInputs/OutlineTextInput";
import VerticalSpace from "../../components/VerticalSpace";
import CheckBox from "../../components/CheckBox";
import PhoneTextInput from "../../components/TextInputs/PhoneTextInput";
import SolidButton from "../../components/Buttons/SolidButton";
import Loader from "../../components/Loader";
import TextButton from "../../components/Buttons/TextButton";
import RoundBackButton from "../../components/Buttons/RoundBackButton";
import { TextInput } from "react-native-paper";

import {
  height,
  heightRem,
  screenRem,
  widthRem,
} from "../../constants/dimensions";
import useApiHook from "../../hooks/rest/useApi";
import { personalInformationSchema } from "../../utils/schema";
import { mask } from "../../constants/miscellaneous";
import {
  BERTIOGASANS_BOLD,
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../constants/fonts";
import {
  BERN_RED,
  BLACK,
  FLINT_STONE,
  JASPER_CANE,
  PINBALL,
  THEME,
  WHITE,
} from "../../constants/colors";
import {
  openURL,
  showSnackDanger,
  showSnackSuccess,
} from "../../utils/functions";
import useDisplayModal from "../../hooks/useDisplayModal";
import OutlineIconTextInput from "../../components/TextInputs/OutlineIconTextInput";
import { TickSquare } from "iconsax-react-native";

const PersonalInformation = () => {
  const formikRef = useRef();
  const { handleRestApi, restApiLoading } = useApiHook();
  const navigation = useNavigation();
  const [isVisible, toggleModal] = useDisplayModal(false);
  const [checkTp, setCheckTp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [registerValues] = useState({
    name: ``,
    phone: ``,
    email: ``,
    password: ``,
    confirmPassword: ``,
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordConfirmVisibility = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  const register = async (values) => {
    if (!isVisible) {
      setCheckTp(true);
      showSnackDanger(
        "Please accept the terms & conditions and privacy policy",
      );
      return;
    }

    Keyboard.dismiss();

    const { password, email, name, phone } = values;

    const data = {
      password,
      email,
      name,
      phone: `+1` + phone,
      registerMethod: "email",
      platform: Platform.OS,
      country: "United States",
      city: "Washington, D.C.",
      isRegisterConsent: true,
    };

    const response = await handleRestApi({
      method: "post",
      url: `register`,
      data,
      headers: { Authorization: "none" },
    });

    if (response?.status === 200) {
      showSnackSuccess(response?.data?.message);
      formikRef.current?.resetForm();

      const timer = setTimeout(() => {
        navigation.navigate(`VerifyEmail`);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  };

  const goToAccessAccount = useCallback(() => {
    navigation.navigate(`AccessAccount`);
  }, [navigation]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      {restApiLoading && <Loader />}

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <RoundBackButton onPress={goBack} />
        <VerticalSpace h={1} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.scrollViewContent}
        >
          <VerticalSpace h={2} />

          <Text style={styles.heading}>Fill Personal{`\n`}Information</Text>

          <VerticalSpace h={2} />

          <Text style={styles.subInfo}>
            For registration, please provide the following details. Your
            information is secure with us.
          </Text>

          <VerticalSpace h={3} />

          <Formik
            innerRef={formikRef}
            validateOnChange
            validateOnBlur
            onSubmit={register}
            initialValues={registerValues}
            validationSchema={personalInformationSchema}
            enableReinitialize
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              isValid,
              dirty,
            }) => {
              return (
                <View>
                  <Field name={`name`}>
                    {({ meta }) => (
                      <OutlineTextInput
                        placeholder={`Full Name`}
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        value={values.name}
                        meta={meta}
                        extraErrorStyles={styles.error}
                      />
                    )}
                  </Field>
                  <VerticalSpace h={1} />

                  <Field name={`email`}>
                    {({ meta }) => (
                      <OutlineTextInput
                        placeholder={`Enter Email`}
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email}
                        meta={meta}
                        extraErrorStyles={styles.error}
                      />
                    )}
                  </Field>
                  <VerticalSpace h={1} />

                  <Field name="phone">
                    {({ meta }) => (
                      <>
                        <PhoneTextInput
                          mask={mask}
                          name="phone"
                          placeholder="Phone Number"
                          keyboardType="numeric"
                          value={values.phone}
                        />
                        {meta.error && (
                          <Text style={styles.errorMessage}>{meta.error}</Text>
                        )}
                      </>
                    )}
                  </Field>
                  <VerticalSpace h={1} />

                  <Field name={`password`}>
                    {({ meta }) => (
                      <OutlineIconTextInput
                        placeholder={`Password`}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        secureTextEntry={!showPassword}
                        value={values.password}
                        meta={meta}
                        extraErrorStyles={styles.error}
                        right={
                          <TextInput.Icon
                            style={styles.icon}
                            name={
                              !showPassword ? "eye-off-outline" : "eye-outline"
                            }
                            color={PINBALL}
                            onPress={togglePassword}
                            size={screenRem * 2}
                          />
                        }
                      />
                    )}
                  </Field>
                  <VerticalSpace h={1} />

                  <Field name={`confirmPassword`}>
                    {({ meta }) => (
                      <OutlineIconTextInput
                        placeholder={`Confirm Password`}
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                        secureTextEntry={!showPasswordConfirm}
                        value={values.confirmPassword}
                        meta={meta}
                        extraErrorStyles={styles.error}
                        right={
                          <TextInput.Icon
                            style={styles.icon}
                            name={
                              !showPasswordConfirm
                                ? "eye-off-outline"
                                : "eye-outline"
                            }
                            color={PINBALL}
                            onPress={togglePasswordConfirmVisibility}
                            size={screenRem * 2}
                          />
                        }
                      />
                    )}
                  </Field>

                  <VerticalSpace h={2} />
                  <CheckBox
                    onPress={() => {
                      toggleModal(), setCheckTp(false);
                    }}
                    // value={isVisible}
                    customLabelTextStyles={{
                      color: checkTp ? "red" : FLINT_STONE,
                    }}
                    color={checkTp ? "red" : isVisible ? THEME : FLINT_STONE}
                    variant={checkTp ? "Linear" : isVisible ? "Bold" : "Linear"}
                    label={
                      <>
                        I accept the{" "}
                        <Text
                          style={{
                            color: checkTp ? "red" : THEME,
                          }}
                          onPress={() =>
                            openURL(
                              `https://www.ezvoltz.app/terms-and-conditions`,
                            )
                          }
                        >
                          Terms and Conditions
                        </Text>{" "}
                        and {"\n"}
                        <Text
                          style={{
                            color: checkTp ? "red" : THEME,
                          }}
                          onPress={() =>
                            openURL(`https://www.ezvoltz.app/privacy-policy`)
                          }
                        >
                          Privacy Policies
                        </Text>
                      </>
                    }
                  />

                  <VerticalSpace h={2} />

                  <SolidButton
                    label={`Finish Setup`}
                    onPress={handleSubmit}
                    disable={!isValid || !dirty}
                  />

                  <VerticalSpace h={2} />

                  <View style={styles.alreadyHaveAccountContainer}>
                    <Text style={styles.alreadyHaveAccount}>
                      Already have an account?
                    </Text>
                    <TextButton
                      label={` Login`}
                      customTextStyle={{ color: THEME }}
                      onPress={goToAccessAccount}
                    />
                  </View>

                  <VerticalSpace h={2} />
                </View>
              );
            }}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PersonalInformation;

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  container: { paddingHorizontal: widthRem * 4, flex: 1 },
  scrollViewContent: {
    flexGrow: 1,
  },
  heading: {
    fontFamily: BERTIOGASANS_BOLD,
    color: BLACK,
    fontSize: screenRem * 2.2,
  },
  error: {
    // marginBottom: heightRem,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  acceptText: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.2,
    color: FLINT_STONE,
    marginLeft: widthRem,
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
    marginVertical: heightRem * 0.2,
  },
  alreadyHaveAccountContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  alreadyHaveAccount: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.2,
    color: FLINT_STONE,
  },
  icon: {
    top: heightRem * 0.5,
  },
});
