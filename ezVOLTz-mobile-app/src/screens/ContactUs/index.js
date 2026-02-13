import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { Field, Formik } from "formik";
import { isEmpty } from "lodash";
import NetworkLogger from "react-native-network-logger";

import VerticalSpace from "../../components/VerticalSpace";
import PrimaryHeader from "../../components/Headers/PrimaryHeader";
import OutlineTextInput from "../../components/TextInputs/OutlineTextInput";
import TextArea from "../../components/TextArea";
import SolidButton from "../../components/Buttons/SolidButton";
import Loader from "../../components/Loader";

import { BERN_RED, BLACK, WHITE } from "../../constants/colors";
import { screenRem, widthRem } from "../../constants/dimensions";
import { verifiedUserSchema, guestUserSchema } from "../../utils/schema";
import { BERTIOGASANS_REGULAR } from "../../constants/fonts";
import useApiHook from "../../hooks/rest/useApi";
import { showSnackSuccess } from "../../utils/functions";

const ContactUs = () => {
  const navigation = useNavigation();
  const formikRef = useRef();
  const { auth } = useSelector((state) => state);
  const { handleRestApi, restApiLoading } = useApiHook();

  const [contactUsValues] = useState(
    isEmpty(auth.user)
      ? {
          name: ``,
          email: ``,
          subject: ``,
          description: ``,
        }
      : {
          subject: ``,
          description: ``,
        }
  );

  const contactUs = async () => {
    Keyboard.dismiss();

    const data = {
      ...formikRef.current?.values,
      ...(!isEmpty(auth.user) && { email: auth.user?.email }),
      ...(!isEmpty(auth.user) && { name: auth.user?.name }),
    };

    const response = await handleRestApi({
      method: "post",
      url: `contact`,
      data,
      headers: { Authorization: "none" },
    });

    if (response.status === 200) {
      showSnackSuccess(response?.data?.message);

      const timer = setTimeout(() => {
        goBack();
        formikRef.current?.resetForm();
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  };

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {restApiLoading && <Loader />}

      <PrimaryHeader
        label={`Contact Us`}
        color={BLACK}
        displayBackButton={true}
        onBackButtonPress={goBack}
      />

      <View style={styles.formContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Formik
            innerRef={formikRef}
            validateOnChange={true}
            validateOnBlur={true}
            onSubmit={contactUs}
            initialValues={contactUsValues}
            validationSchema={
              isEmpty(auth.user) ? guestUserSchema : verifiedUserSchema
            }
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => {
              return (
                <>
                  <VerticalSpace h={4} />

                  {isEmpty(auth.user) && (
                    <>
                      <Field name={`name`}>
                        {({ meta }) => (
                          <>
                            <OutlineTextInput
                              placeholder={`Name`}
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
                    </>
                  )}

                  <Field name={`subject`}>
                    {({ meta }) => (
                      <>
                        <OutlineTextInput
                          placeholder={`Subject`}
                          onChangeText={handleChange("subject")}
                          onBlur={handleBlur("subject")}
                          value={values.subject}
                        />

                        <VerticalSpace h={1} />

                        <Text style={styles.errorMessage}>
                          {meta.touched ? meta.error : null}
                        </Text>
                      </>
                    )}
                  </Field>

                  <VerticalSpace h={1} />

                  <Field name={`description`}>
                    {({ meta }) => (
                      <>
                        <TextArea
                          placeholder={`Message`}
                          onChangeText={handleChange("description")}
                          onBlur={handleBlur("description")}
                          value={values.description}
                        />

                        <VerticalSpace h={1} />

                        <Text style={styles.errorMessage}>
                          {meta.touched ? meta.error : null}
                        </Text>
                      </>
                    )}
                  </Field>

                  <VerticalSpace h={2} />

                  <SolidButton
                    label={`Submit`}
                    size={`xl`}
                    onPress={handleSubmit}
                  />

                  {/* <NetworkLogger /> */}
                </>
              );
            }}
          </Formik>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  formContainer: {
    alignSelf: "center",
    flex: 1,
  },
  errorMessage: {
    color: BERN_RED,
    fontSize: screenRem,
    fontFamily: BERTIOGASANS_REGULAR,
    marginLeft: widthRem * 6,
  },
});
