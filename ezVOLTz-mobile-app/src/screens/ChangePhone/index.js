import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import { Keyboard, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Field, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import PrimaryHeader from "../../components/Headers/PrimaryHeader";
import PhoneTextInput from "../../components/TextInputs/PhoneTextInput";
import VerticalSpace from "../../components/VerticalSpace";
import SolidButton from "../../components/Buttons/SolidButton";
import Loader from "../../components/Loader";
import PhoneVerificationModal from "../../components/Modals/PhoneVerificationModal";

import { BERN_RED, BLACK, WHITE } from "../../constants/colors";
import { mask } from "../../constants/miscellaneous";
import { changePhoneSchema } from "../../utils/schema";
import { screenRem, widthRem } from "../../constants/dimensions";
import { BERTIOGASANS_REGULAR } from "../../constants/fonts";
import useApiHook from "../../hooks/rest/useApi";
import useDisplayModal from "../../hooks/useDisplayModal";
import { showSnackSuccess } from "../../utils/functions";
import { setAuthFields } from "../../redux/slices/auth/slice";

const ChangePhone = () => {
  const navigation = useNavigation();
  const formikRef = useRef();
  const dispatch = useDispatch();
  const { handleRestApi, restApiLoading } = useApiHook();
  const { auth } = useSelector((state) => state);
  const [phoneVerificationModal, togglePhoneVerificationModal] =
    useDisplayModal(false);

  const USER_ID = auth?.user?._id;

  const [fromValues] = useState({
    phone: "",
  });

  const changePhone = async () => {
    Keyboard.dismiss();

    const data = {
      phone: `+1` + formikRef.current?.values?.phone,
    };

    // const data = {
    //   phone: `+923119572578`,
    // };

    const response = await handleRestApi({
      method: "post",
      url: `user/sms-verification/${USER_ID}`,
      data,
    });

    if (response.status === 200) {
      togglePhoneVerificationModal();
    }
  };

  const handleVerificationCode = async (vCode) => {
    togglePhoneVerificationModal();

    const data = {
      phone: `+1` + formikRef.current?.values?.phone,
      otpCode: vCode,
    };

    // const data = {
    //   phone: `+923119572578`,
    //   otpCode: vCode,
    // };

    const response = await handleRestApi({
      method: "post",
      url: `user/sms-verification-code/${USER_ID}`,
      data,
    });

    if (response?.status === 200) {
      dispatch(setAuthFields({ user: { ...auth.user, phone: data.phone } }));
      showSnackSuccess(response.data.message);

      const timer = setTimeout(() => {
        goBack();
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: WHITE,
      }}
    >
      {restApiLoading && <Loader />}

      <PhoneVerificationModal
        label={`Verify Phone`}
        isVisible={phoneVerificationModal}
        onCloseModal={togglePhoneVerificationModal}
        getVerificationCode={handleVerificationCode}
      />

      <PrimaryHeader
        label={`Change Phone`}
        color={BLACK}
        displayBackButton={true}
        onBackButtonPress={goBack}
      />

      <View style={{ alignItems: "center" }}>
        <Formik
          innerRef={formikRef}
          validateOnChange={true}
          validateOnBlur={true}
          onSubmit={changePhone}
          initialValues={fromValues}
          validationSchema={changePhoneSchema}
          enableReinitialize={true}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => {
            return (
              <View>
                <VerticalSpace h={2} />

                <Field name={`phone`}>
                  {({ meta }) => (
                    <>
                      <PhoneTextInput
                        mask={mask}
                        name="phone"
                        placeholder="Phone Number"
                        keyboardType="numeric"
                        value={values.phone}
                        onChangeText={handleChange("phone")}
                        onBlur={handleBlur("phone")}
                      />

                      <VerticalSpace h={1} />

                      <Text style={styles.errorMessage}>
                        {meta.touched ? meta.error : null}
                      </Text>
                    </>
                  )}
                </Field>

                <VerticalSpace h={1} />

                <SolidButton
                  label={`Send Verification Code`}
                  onPress={handleSubmit}
                />
              </View>
            );
          }}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default ChangePhone;

const styles = StyleSheet.create({
  errorMessage: {
    color: BERN_RED,
    fontSize: screenRem,
    fontFamily: BERTIOGASANS_REGULAR,
    marginLeft: widthRem * 6,
  },
});
