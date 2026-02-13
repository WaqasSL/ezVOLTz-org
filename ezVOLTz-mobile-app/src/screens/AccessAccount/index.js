import React, { useCallback, useRef } from "react";
import useState from "react-usestateref";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  Keyboard,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Eye, EyeSlash } from "iconsax-react-native";
import { Field, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { AccessToken, LoginManager, Profile } from "react-native-fbsdk-next";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  appleAuth,
  appleAuthAndroid,
} from "@invertase/react-native-apple-authentication";
import { isNull } from "lodash";
import { TextInput } from "react-native-paper";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";

import OutlineTextInput from "../../components/TextInputs/OutlineTextInput";
import VerticalSpace from "../../components/VerticalSpace";
import TextButton from "../../components/Buttons/TextButton";
import SolidButton from "../../components/Buttons/SolidButton";
import OutlineIconTextInput from "../../components/TextInputs/OutlineIconTextInput";
import HorizontalSpace from "../../components/HorizontalSpace";
import SocialLoginButton from "./components/SocialLoginButton";
import Loader from "../../components/Loader";
import GoogleModal from "../../components/Modals/GoogleModal";
import FacebookModal from "../../components/Modals/FacebookModal";
import AppleModal from "../../components/Modals/AppleModal";
import RoundBackButton from "../../components/Buttons/RoundBackButton";

import { setAuthFields } from "../../redux/slices/auth/slice";
import {
  height,
  heightRem,
  screenRem,
  widthRem,
} from "../../constants/dimensions";
import { openURL, requestUserPermission } from "../../utils/functions";
import { loginWithEmailSchema } from "../../utils/schema";
import {
  BERTIOGASANS_BOLD,
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../constants/fonts";
import { APPLE, GOOGLE, FACEBOOK, GUEST } from "../../assets/icons";
import {
  BERN_RED,
  BLACK,
  FLINT_STONE,
  JASPER_CANE,
  PINBALL,
  THEME,
  WHITE,
  WHITE_SMOKE,
} from "../../constants/colors";
import { EZVOLTZ_LOGO_SECONDARY } from "../../constants/svg";
import useApiHook from "../../hooks/rest/useApi";
import { showSnackDanger, showSnackSuccess } from "../../utils/functions";
import { setManufactures } from "../../redux/slices/manufactures/slice";
import { WILD_DOVE } from "../../constants/colors";

const AccessAccount = () => {
  const formikRef = useRef();
  const { handleRestApi, restApiLoading } = useApiHook();
  const { auth } = useSelector((state) => state);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [loginWithEmailValues] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginWithGoogleModal, setShowLoginWithGoogleModal] =
    useState(false);
  const [loginWithGoogleInitialValues] = useState({
    phone: "",
  });
  const [showLoginWithFacebookModal, setShowLoginWithFacebookModal] =
    useState(false);
  const [loginWithFacebookInitialValues] = useState({
    phone: "",
    email: "",
  });
  const [showLoginWithAppleModal, setShowLoginWithAppleModal] = useState(false);
  const [loginWithAppleInitialValues] = useState({
    phone: "",
    email: "",
    name: "",
  });
  const [socialLoginResponse, setSocialLoginResponse] = useState({});
  const [_, setLoginFlow, loginFlowRef] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleLoginWithGoogleModal = () => {
    setShowLoginWithGoogleModal(!showLoginWithGoogleModal);
  };

  const toggleLoginWithFacebookModal = () => {
    setShowLoginWithFacebookModal(!showLoginWithFacebookModal);
  };

  const toggleLoginWithAppleModal = () => {
    setShowLoginWithAppleModal(!showLoginWithAppleModal);
  };

  // const loginWithEmail = async () => {
  //   Keyboard.dismiss();

  //   const data = {
  //     ...formikRef.current.values,
  //     registerMethod: `email`,
  //   };

  //   const response = await handleRestApi({
  //     method: "post",
  //     url: `login`,
  //     data,
  //     headers: { Authorization: "none" },
  //   });

  //   if (response?.status === 200 && response?.data?.isEmailSent) {
  //     showSnackSuccess(response?.data?.message);
  //   }

  //   if (response?.status === 200 && !response?.data?.isEmailSent) {
  //     const fcmToken = await requestUserPermission();

  //     if (fcmToken) {
  //       showSnackSuccess(`Login Successful`);
  //       const { user, accessToken, refreshToken } = response?.data;
  //       dispatch(setAuthFields({ user, accessToken, refreshToken }));
  //       formikRef.current?.resetForm();
  //       getAllManufactures(accessToken);
  //       firebaseNotificationsToken(accessToken, fcmToken);
  //     } else {
  //       showSnackSuccess(`Login Successful`);
  //       const { user, accessToken, refreshToken } = response?.data;
  //       dispatch(setAuthFields({ user, accessToken, refreshToken }));
  //       formikRef.current?.resetForm();
  //       getAllManufactures(accessToken);
  //     }
  //   }
  // };

  const loginWithEmail = async () => {
    Keyboard.dismiss();
    dispatch(
      setAuthFields({
        user: {},
        accessToken: null,
        refreshToken: null,
        displayOnboarding: false,
      }),
    );
    const data = {
      ...formikRef.current.values,
      registerMethod: `email`,
    };

    const response = await handleRestApi({
      method: "post",
      url: `login`,
      data,
      headers: { Authorization: "none" },
    });

    if (response?.status === 200) {
      console.log("response.data.accessToken", response.data.accessToken);
      if (response.data.isEmailSent) {
        showSnackSuccess(response.data.message);
      } else {
        // const fcmToken = await requestUserPermission();
        showSnackSuccess(`Login Successful`);
        const { user, accessToken, refreshToken } = response.data;
        dispatch(
          setAuthFields({
            user,
            accessToken: response.data.accessToken,
            refreshToken,
          }),
        );
        formikRef.current?.resetForm();
        getAllManufactures(accessToken);
        // if (fcmToken) {
        //   firebaseNotificationsToken(accessToken, fcmToken);
        // }
      }
    }
  };

  const loginWithGoogle = async () => {
    setLoginFlow(`google`);

    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    const { photo, name, email } = userInfo?.user;

    const data = {
      email,
      name,
      profileImage: photo,
      registerMethod: "google",
      platform: Platform.OS,
    };

    loginSocial(data);
  };

  const loginWithFacebook = async () => {
    setLoginFlow(`facebook`);

    const result = await LoginManager.logInWithPermissions([
      "email",
      "public_profile",
    ]);

    if (result.isCancelled)
      return showSnackDanger("The user canceled the sign in request.");
    const token = await AccessToken.getCurrentAccessToken();
    if (!token) return showSnackDanger("Unable to login at the moment.");
    const profile = await Profile.getCurrentProfile();

    const data = {
      name: profile?.firstName + " " + profile?.lastName,
      fbUserId: profile?.userID,
      // email: profile?.email ? profile?.email : ``,
      profileImage: profile?.imageURL ? profile?.imageURL : ``,
      registerMethod: "facebook",
      platform: Platform.OS,
    };

    loginSocial(data);
  };

  const loginWithAppleAND = async () => {
    const rawNonce = uuid();
    const state = uuid();

    appleAuthAndroid.configure({
      clientId: "com.ezvoltz.auth",
      redirectUri: "https://www.ezvoltz.app",
      responseType: appleAuthAndroid.ResponseType.ALL,
      scope: appleAuthAndroid.Scope.ALL,
      nonce: rawNonce,
      state,
    });

    const response = await appleAuthAndroid.signIn();

    const data = {
      registerMethod: "apple",
      platform: Platform.OS,
      authorization: {
        code: response.code,
        id_token: response.id_token,
      },
    };

    loginSocial(data);
  };

  const loginWithAppleIOS = async () => {
    setLoginFlow(`apple`);

    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const data = {
      appleId: appleAuthRequestResponse.user,
      registerMethod: "apple",
      platform: Platform.OS,
      authorization: {
        code: appleAuthRequestResponse.authorizationCode,
        id_token: appleAuthRequestResponse.identityToken,
      },
      ...(!isNull(appleAuthRequestResponse.email) && {
        email: appleAuthRequestResponse.email,
        name: `${appleAuthRequestResponse?.fullName?.givenName} ${appleAuthRequestResponse?.fullName?.familyName}`,
      }),
    };

    loginSocial(data);
  };

  const loginSocial = async (data) => {
    const response = await handleRestApi({
      method: "post",
      url:
        loginFlowRef.current !== `apple`
          ? `social-login`
          : `apple/apple-signin`,
      data,
      headers: { Authorization: "none" },
    });

    if (response?.status === 203) {
      setSocialLoginResponse(response?.data);

      if (loginFlowRef.current === `facebook`) toggleLoginWithFacebookModal();
      if (loginFlowRef.current === `google`) toggleLoginWithGoogleModal();
      if (loginFlowRef.current === `apple`) toggleLoginWithAppleModal();
    }

    if (response?.status === 200) {
      // const fcmToken = await requestUserPermission();

      // if (fcmToken) {
      //   const { user, accessToken, refreshToken } = response?.data;
      //   dispatch(setAuthFields({ user, accessToken, refreshToken }));
      //   getAllManufactures(accessToken);
      //   firebaseNotificationsToken(accessToken, fcmToken);
      // } else {
      const { user, accessToken, refreshToken } = response?.data;
      dispatch(setAuthFields({ user, accessToken, refreshToken }));
      getAllManufactures(accessToken);
      // }
    }
  };

  const getAllManufactures = async (accessToken) => {
    const response = await handleRestApi({
      method: "get",
      url: `vehicle-manufacture`,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response?.status === 200) {
      dispatch(setManufactures(response?.data?.vehicleManufactur));
      goToHome();
    }
  };

  const firebaseNotificationsToken = async (accessToken, fcmToken) => {
    const data = {
      platform: Platform.OS,
      token: fcmToken,
    };

    await handleRestApi({
      method: "post",
      url: `user/update-firebase-token`,
      data,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  const goToForgotPassword = useCallback(() => {
    navigation.navigate(`ForgotPassword`);
  }, [navigation]);

  const goToPersonalInformation = useCallback(() => {
    navigation.navigate(`PersonalInformation`);
  }, [navigation]);

  const goToHome = useCallback(() => {
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

      <GoogleModal
        isVisible={showLoginWithGoogleModal}
        closeModal={toggleLoginWithGoogleModal}
        initialValues={loginWithGoogleInitialValues}
        onSubmit={(values) =>
          loginSocial({
            ...socialLoginResponse,
            phone: values.phone,
            platform: Platform.OS,
          })
        }
      />

      <FacebookModal
        closeModal={toggleLoginWithFacebookModal}
        initialValues={loginWithFacebookInitialValues}
        onSubmit={(values) =>
          loginSocial({
            ...socialLoginResponse,
            phone: values.phone,
            email: values.email,
            platform: Platform.OS,
          })
        }
      />

      <AppleModal
        isVisible={showLoginWithAppleModal}
        closeModal={toggleLoginWithAppleModal}
        initialValues={loginWithAppleInitialValues}
        onSubmit={(values) =>
          loginSocial({
            ...socialLoginResponse,
            phone: values.phone,
            email: values.email,
            name: values.name,
            platform: Platform.OS,
          })
        }
      />
      <ScrollView keyboardShouldPersistTaps={"always"} scrollEnabled={false}>
        <Pressable
          onPress={() => Keyboard.dismiss()}
          style={{
            height: Platform.OS === "android" ? heightRem * 98 : heightRem * 90,
            justifyContent: "space-between",
          }}
        >
          <View style={styles.childContainer}>
            <RoundBackButton
              onPress={goBack}
              extraContainerStyles={{ marginTop: heightRem * 2 }}
            />

            <Text style={styles.heading}>Access Your{`\n`}Account</Text>

            <Text style={styles.subInfo}>
              Use your ezVOLTz username and password to access your account
            </Text>

            <Formik
              innerRef={formikRef}
              validateOnChange
              validateOnBlur
              onSubmit={loginWithEmail}
              initialValues={loginWithEmailValues}
              validationSchema={loginWithEmailSchema}
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
                  <>
                    <Field name="email">
                      {({ meta }) => (
                        <OutlineTextInput
                          placeholder={`Enter Email`}
                          onChangeText={handleChange("email")}
                          onBlur={handleBlur("email")}
                          value={values.email}
                          meta={meta}
                        />
                      )}
                    </Field>
                    <VerticalSpace h={1} />
                    <Field name="password">
                      {({ meta }) => (
                        <OutlineIconTextInput
                          placeholder={`Enter Password`}
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          secureTextEntry={!showPassword}
                          value={values.password}
                          right={
                            <TextInput.Icon
                              style={styles.icon}
                              name={
                                showPassword ? "eye-off-outline" : "eye-outline"
                              }
                              color={PINBALL}
                              onPress={togglePasswordVisibility}
                              size={screenRem * 2}
                            />
                          }
                          meta={meta}
                        />
                      )}
                    </Field>
                    <VerticalSpace h={2} />

                    <View style={styles.forgotPasswordContainer}>
                      <TextButton
                        label={`Forgot Password?`}
                        customTextStyle={{ color: THEME }}
                        onPress={goToForgotPassword}
                      />
                    </View>

                    <SolidButton
                      label={`Login`}
                      onPress={handleSubmit}
                      customButtonStyle={{ marginVertical: heightRem * 2.2 }}
                      disable={!isValid || !dirty}
                    />

                    <View style={styles.dontHaveAccountContainer}>
                      <Text style={styles.dontHaveAccount}>
                        Don't have an account?
                      </Text>
                      <TextButton
                        label={` Continue with email`}
                        customTextStyle={{ color: THEME }}
                        onPress={goToPersonalInformation}
                      />
                    </View>
                  </>
                );
              }}
            </Formik>
            <View style={{ marginTop: heightRem * 3.6 }}>
              <Text style={styles.orContinueWith}>or continue with</Text>

              <VerticalSpace h={2} />

              <View style={styles.socialLoginContainer}>
                <SocialLoginButton
                  label={`Apple`}
                  onPress={
                    Platform.OS === "ios"
                      ? loginWithAppleIOS
                      : loginWithAppleAND
                  }
                >
                  <APPLE height={screenRem * 2} width={screenRem * 2} />
                </SocialLoginButton>

                <SocialLoginButton
                  label={`Facebook`}
                  onPress={loginWithFacebook}
                >
                  <FACEBOOK height={screenRem * 2} width={screenRem * 2} />
                </SocialLoginButton>

                <SocialLoginButton label={`Google`} onPress={loginWithGoogle}>
                  <GOOGLE height={screenRem * 2} width={screenRem * 2} />
                </SocialLoginButton>

                <SocialLoginButton label={`Guest`} onPress={goToHome}>
                  <GUEST height={screenRem * 2} width={screenRem * 2} />
                </SocialLoginButton>
              </View>
            </View>
          </View>

          <View
            style={{
              ...styles.childContainer,
              alignItems: "center",
            }}
          >
            <EZVOLTZ_LOGO_SECONDARY />

            <VerticalSpace h={2} />

            <View style={styles.bottomButtonsContainer}>
              <TextButton
                label={`About Us`}
                customTextStyle={{ color: FLINT_STONE, fontSize: screenRem }}
                onPress={() => openURL(`http://www.ezvoltz.com/about-us/`)}
              />

              <HorizontalSpace w={2} />

              <View style={styles.dot} />

              <HorizontalSpace w={2} />

              <TextButton
                label={`Terms & Conditions`}
                customTextStyle={{ color: FLINT_STONE, fontSize: screenRem }}
                onPress={() =>
                  openURL(`https://www.ezvoltz.app/terms-and-conditions`)
                }
              />

              <HorizontalSpace w={2} />

              <View style={styles.dot} />

              <HorizontalSpace w={2} />

              <TextButton
                label={`Privacy Policies`}
                customTextStyle={{ color: FLINT_STONE, fontSize: screenRem }}
                onPress={() =>
                  openURL(`https://www.ezvoltz.app/privacy-policy`)
                }
              />
            </View>

            <VerticalSpace h={2} />
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccessAccount;

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  childContainer: { paddingHorizontal: widthRem * 4 },
  heading: {
    fontFamily: BERTIOGASANS_BOLD,
    color: BLACK,
    fontSize: screenRem * 2.6,
    marginTop: heightRem * 2,
  },
  subInfo: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.2,
    color: WILD_DOVE,
    lineHeight: screenRem * 2,
    marginVertical: heightRem,
  },
  forgotPasswordContainer: { alignSelf: "flex-end" },
  dontHaveAccountContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  dontHaveAccount: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.2,
    color: WILD_DOVE,
  },
  orContinueWith: {
    color: BLACK,
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.2,
    textAlign: "center",
  },
  socialLoginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: widthRem * 12,
  },
  dot: {
    height: screenRem * 0.2,
    width: screenRem * 0.2,
    borderRadius: screenRem * 0.1,
    backgroundColor: FLINT_STONE,
    alignSelf: "center",
  },
  bottomButtonsContainer: {
    flexDirection: "row",
  },

  icon: {
    top: heightRem * 0.5,
  },
});
