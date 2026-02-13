import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import { Keyboard, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Field, Formik } from "formik";
import { useSelector } from "react-redux";

import VerticalSpace from "../../components/VerticalSpace";
import PrimaryHeader from "../../components/Headers/PrimaryHeader";
import SolidButton from "../../components/Buttons/SolidButton";
import CheckBox from "../../components/CheckBox";
import OutlineTextInput from "../../components/TextInputs/OutlineTextInput";
import Loader from "../../components/Loader";

import { BERN_RED, BLACK, WHITE } from "../../constants/colors";
import { screenRem, widthRem } from "../../constants/dimensions";
import { BERTIOGASANS_REGULAR } from "../../constants/fonts";
import { changePasswordSchema, setPasswordSchema } from "../../utils/schema";
import useDisplayModal from "../../hooks/useDisplayModal";
import useApiHook from "../../hooks/rest/useApi";
import { showSnackSuccess } from "../../utils/functions";

const Password = () => {
  const navigation = useNavigation();
  const formikRef = useRef();
  const { auth } = useSelector((state) => state);
  const [passwordVisibility, togglePasswordVisibility] = useDisplayModal(false);
  const { handleRestApi, restApiLoading } = useApiHook();

  const PASSWORD = auth.user?.password;
  const USER_ID = auth.user?._id;

  const [passwordValues, setPasswordValues] = useState(
    PASSWORD
      ? {
        currentPassword: ``,
        newPassword: ``,
        confirmNewPassword: ``,
      }
      : {
        newPassword: ``,
        confirmNewPassword: ``,
      }
  );

  const modifyPassword = async (values) => {
    Keyboard.dismiss();
    const data = {
      password: values.newPassword,
      confirmPassword: values.confirmNewPassword,
    };
    const response = await handleRestApi({
      method: "patch",
      url: `user/profile-password/${USER_ID}`,
      data,
    });
    if (response.status === 200) {
      showSnackSuccess(response.data.message);

      const timer = setTimeout(() => {
        goToAppTabs();
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  };

  const goToAppTabs = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: "AppTabs" }],
    });
  }, [navigation]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      {restApiLoading && <Loader />}

      <PrimaryHeader
        label={PASSWORD ? `Change Password` : `Set Password`}
        color={BLACK}
        displayBackButton={true}
        onBackButtonPress={goBack}
      />

      <View style={styles.formContainer}>
        <Formik
          innerRef={formikRef}
          validateOnChange={true}
          validateOnBlur={true}
          onSubmit={modifyPassword}
          initialValues={passwordValues}
          validationSchema={PASSWORD ? changePasswordSchema : setPasswordSchema}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => {
            return (
              <>
                <VerticalSpace h={1} />

                {PASSWORD !== '' && (
                  <>
                    <Field name="currentPassword">
                      {({ meta }) => (
                        <>
                          <OutlineTextInput
                            placeholder={`Enter Current Password`}
                            onChangeText={handleChange("currentPassword")}
                            onBlur={handleBlur("currentPassword")}
                            secureTextEntry={!passwordVisibility}
                            value={values.currentPassword}
                          />

                          <VerticalSpace h={0.5} />
                          {meta.touched &&
                            <Text style={styles.errorMessage}>
                              {meta.touched ? meta.error : null}
                            </Text>}
                        </>
                      )}
                    </Field>

                    <VerticalSpace h={1} />
                  </>
                )}

                <Field name="newPassword">
                  {({ meta }) => (
                    <>
                      <OutlineTextInput
                        placeholder={`Enter New Password`}
                        onChangeText={handleChange("newPassword")}
                        onBlur={handleBlur("newPassword")}
                        secureTextEntry={!passwordVisibility}
                        value={values.newPassword}
                      />


                      <VerticalSpace h={0.5} />
                      {meta.touched &&
                        <Text style={styles.errorMessage}>
                          {meta.touched ? meta.error : null}
                        </Text>}
                    </>
                  )}
                </Field>

                <VerticalSpace h={1} />

                <Field name="confirmNewPassword">
                  {({ meta }) => (
                    <>
                      <OutlineTextInput
                        placeholder={`Confirm New Password`}
                        onChangeText={handleChange("confirmNewPassword")}
                        onBlur={handleBlur("confirmNewPassword")}
                        secureTextEntry={!passwordVisibility}
                        value={values.confirmNewPassword}
                      />

                      <VerticalSpace h={0.5} />
                      {meta.touched &&
                        <Text style={styles.errorMessage}>
                          {meta.touched ? meta.error : null}
                        </Text>}
                    </>
                  )}
                </Field>

                <VerticalSpace h={2} />

                <CheckBox
                  label={`Show Password`}
                  onPress={togglePasswordVisibility}
                  value={passwordVisibility}
                />

                <VerticalSpace h={2} />

                <SolidButton
                  label={`Save`}
                  size={`xl`}
                  onPress={handleSubmit}
                />
              </>
            );
          }}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default Password;

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  errorMessage: {
    color: BERN_RED,
    fontSize: screenRem,
    fontFamily: BERTIOGASANS_REGULAR,
    marginLeft: widthRem * 6,
  },
  formContainer: {
    flex: 1,
    alignSelf: "center",
  },
});
