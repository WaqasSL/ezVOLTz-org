import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { launchImageLibrary } from "react-native-image-picker";
import { isNull } from "lodash";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import OutlineTextInput from "../../components/TextInputs/OutlineTextInput";
import VerticalSpace from "../../components/VerticalSpace";
import PhoneButtonTextInput from "../../components/TextInputs/PhoneButtonTextInput";
import SolidButton from "../../components/Buttons/SolidButton";
import OutlineInfoView from "../../components/OutlineInfoView";
import DropdownModal from "../../components/Modals/DropdownModal";
import Loader from "../../components/Loader";
import ProgressiveImage from "../../components/ProgressiveImage";
import DecisionModal from "../../components/Modals/DecisionModal";
import TextButton from "../../components/Buttons/TextButton";
import Line from "../../components/Line";
import CheckBox from "../../components/CheckBox";

import PrimaryHeader from "../../components/Headers/PrimaryHeader";
import {
  BERN_RED,
  BLACK,
  FLINT_STONE,
  JASPER_CANE,
  THEME,
  TROLLEY_GREY,
  WHITE,
} from "../../constants/colors";
import {
  mask,
  statesData,
  singleImageOptions,
} from "../../constants/miscellaneous";
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../constants/fonts";
import { screenRem, widthRem } from "../../constants/dimensions";
import useDisplayModal from "../../hooks/useDisplayModal";
import { showSnackDanger, showSnackSuccess } from "../../utils/functions";
import useApiHook from "../../hooks/rest/useApi";
import { setAuthFields, clearAuth } from "../../redux/slices/auth/slice";
import images from "../../constants/images";
import { PROFILE_CAMERA } from "../../assets/icons";
import useFetchApi from "../../hooks/useFetchApi";
import { clearFilter } from "../../redux/slices/filter/slice";
import Entypo from "react-native-vector-icons/Entypo";

const MyProfile = () => {
  const navigation = useNavigation();
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [stateModal, toggleStateModal] = useDisplayModal(false);
  const [deleteProfileModal, toggleDeleteProfileModal] = useDisplayModal(false);
  const [receiveEmail, toggleReceiveEmail] = useDisplayModal(
    auth.user.isRegisterConsent,
  );
  const { handleRestApi, restApiLoading } = useApiHook();
  const { fetchApiCall, fetchApiLoading } = useFetchApi();

  const USER_ID = auth.user?._id;

  const [profile, setProfile] = useState({
    profileImage: { uri: auth.user?.profileImage, type: null, name: null },
    name: auth.user?.name,
    city: auth.user?.city,
    state:
      auth.user?.state === ""
        ? {}
        : statesData.find((state) => state.value === auth.user?.state),
    zipCode: auth.user?.zipCode,
  });

  const handleUploadProfileImage = async () => {
    Keyboard.dismiss();

    launchImageLibrary(
      singleImageOptions,
      ({ didCancel, errorCode, assets }) => {
        if (didCancel) {
        } else if (errorCode) {
          showSnackDanger(
            "There is an issue with this image. Please select another one",
          );
        } else if (assets[0]?.height === 0 || assets[0]?.width === 0) {
          showSnackDanger(
            "There is an issue with this image. Please select another one",
          );
        } else {
          const data = {
            uri: assets[0].uri,
            type: assets[0].type,
            name: assets[0].fileName,
          };
          onFieldChange("profileImage", data);

          updateProfileImage(data);
        }
      },
    );
  };

  const updateProfileImage = async (data) => {
    let formData = new FormData();
    formData.append("image", data);
    const response = await fetchApiCall(
      `user/profile-image/${USER_ID}`,
      `post`,
      {
        Authorization: `Bearer ${auth.accessToken}`,
      },
      formData,
    );
    if (response.status === 200) {
      showSnackSuccess(response.data.message);
      getUserProfile();
    }
  };

  const getUserProfile = async () => {
    const response = await handleRestApi({
      method: "get",
      url: `user/profile`,
    });

    if (response.status === 200) {
      dispatch(setAuthFields({ user: response.data.user }));
    }
  };

  const updateProfile = async () => {
    Keyboard.dismiss();
    const data = { ...profile, state: profile?.state?.value };
    delete data.profileImage;

    if (data.name === "") {
      showSnackDanger(`Full name cannot be empty`);
    } else {
      const response = await handleRestApi({
        method: "patch",
        url: `user/profile/${USER_ID}`,
        data,
      });
      if (response.status === 200) {
        getUserProfile();
        showSnackSuccess(response.data.message);
      }
    }
  };

  const handleReceiveUpdates = async () => {
    toggleReceiveEmail();

    const data = { isRegisterConsent: !receiveEmail };

    const response = await handleRestApi({
      method: "patch",
      url: `user/profile/consent/${USER_ID}`,
      data,
    });

    if (response.status === 200) {
      getUserProfile();
      showSnackSuccess(response.data.message);
    }
  };

  const onFieldChange = (key, value) => {
    setProfile({ ...profile, [key]: value });
  };

  const verifyPlatform = async () => {
    toggleDeleteProfileModal();

    if (!isNull(auth.user.appleUserId)) {
      const response = await handleRestApi({
        method: "post",
        url: `apple/revoke-token`,
        data: {
          token: auth.user.appleRefreshToken,
          platform: Platform.OS,
        },
      });

      if (response.status === 200) {
        handleDeleteAccount();
      }
    } else {
      handleDeleteAccount();
    }
  };

  const handleDeleteAccount = async () => {
    const response = await handleRestApi({
      method: "delete",
      url: `user/profile/delete/${USER_ID}`,
    });

    if (response.status === 200) {
      goBack();

      const timer = setTimeout(async () => {
        await Promise.all([
          dispatch(clearAuth()),
          dispatch(clearFilter()),
          GoogleSignin.revokeAccess(),
          GoogleSignin.signOut(),
        ]);
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }
  };

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const goToChangePhone = useCallback(() => {
    navigation.navigate("ChangePhone");
  }, [navigation]);

  const goToPassword = useCallback(() => {
    navigation.navigate("Password");
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {restApiLoading || fetchApiLoading ? <Loader /> : null}

      <DropdownModal
        label={`State`}
        data={statesData}
        isVisible={stateModal}
        onCloseModal={toggleStateModal}
        getSelectedItem={(val) => onFieldChange(`state`, val)}
        value={profile?.state}
      />

      <DecisionModal
        isVisible={deleteProfileModal}
        label={`Delete Account Confirmation`}
        message={`Are you sure you want to delete the account? After deleting your account, you will not be able to access it.`}
        leftButtonText={`No`}
        rightButtonText={`Yes`}
        leftButtonPress={toggleDeleteProfileModal}
        rightButtonPress={verifyPlatform}
      />

      <PrimaryHeader
        label={`My Profile`}
        color={BLACK}
        displayBackButton={true}
        onBackButtonPress={goBack}
      />

      <KeyboardAvoidingView
        style={styles.formContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={"always"}
        >
          <VerticalSpace h={2} />

          <View style={styles.profileImageContainer}>
            <ProgressiveImage
              source={
                profile.profileImage === ""
                  ? images.defaultUser
                  : { uri: profile?.profileImage?.uri }
              }
              style={styles.profileImage}
              defaultImageSource={images.progressiveImage}
            />
            <Pressable
              style={styles.addProfileImageButton}
              onPress={handleUploadProfileImage}
            >
              <PROFILE_CAMERA />
            </Pressable>
          </View>

          <VerticalSpace h={2} />

          <OutlineTextInput
            placeholder={`Full Name`}
            value={profile?.name}
            onChangeText={(val) => onFieldChange(`name`, val)}
          />

          <VerticalSpace h={2} />

          <OutlineTextInput
            placeholder={`Email`}
            editable={false}
            value={auth?.user?.email}
          />

          <VerticalSpace h={2} />

          <PhoneButtonTextInput
            mask={mask}
            editable={false}
            value={auth?.user?.phone.slice(-10)}
            button={
              <TextButton
                label={`Change Phone`}
                customTextStyle={styles.themeTextButton}
                onPress={goToChangePhone}
              />
            }
          />

          <VerticalSpace h={2} />

          <OutlineInfoView
            label={`Password`}
            value={`•••••••••••`}
            right={
              <TextButton
                label={auth.user.password ? `Change Password` : `Set Password`}
                customTextStyle={styles.themeTextButton}
                onPress={goToPassword}
              />
            }
          />

          <VerticalSpace h={2} />

          <OutlineTextInput
            placeholder={`Country`}
            editable={false}
            value={auth?.user?.country}
          />

          <VerticalSpace h={2} />

          <OutlineTextInput
            placeholder={`City`}
            value={profile?.city}
            onChangeText={(val) => onFieldChange(`city`, val)}
            keyboardType={
              Platform.OS === "ios" ? "ascii-capable" : "visible-password"
            }
          />

          <VerticalSpace h={2} />

          <OutlineInfoView
            label={`State`}
            value={
              auth.user?.state === ""
                ? `Select your state`
                : profile?.state?.label
            }
            onPress={toggleStateModal}
            right={
              <Entypo
                name="chevron-thin-down"
                size={screenRem * 1.6}
                color={TROLLEY_GREY}
              />
            }
            valueTextStyles={{
              fontSize:
                auth.user?.state === "" ? screenRem * 1.1 : screenRem * 1.2,
              color: auth.user?.state === "" ? TROLLEY_GREY : BLACK,
            }}
          />

          <VerticalSpace h={2} />

          <OutlineTextInput
            placeholder={`Zip Code`}
            value={profile.zipCode}
            onChangeText={(val) => onFieldChange(`zipCode`, val)}
          />

          <VerticalSpace h={2} />

          {/* <CheckBox
            label={`Receive email updates`}
            onPress={handleReceiveUpdates}
            value={receiveEmail}
          /> */}

          <VerticalSpace h={2} />

          <SolidButton
            size={"xl"}
            label={`Update Changes`}
            onPress={updateProfile}
          />

          <VerticalSpace h={4} />

          <Line />

          <VerticalSpace h={4} />

          <View>
            <Text style={styles.dangerZoneText}>Delete account</Text>

            <VerticalSpace h={2} />

            <Text style={styles.deleteProfileInfo}>
              Deleting your account will delete all of your data, as well as
              your payment information.
            </Text>
          </View>

          <VerticalSpace h={2} />

          <SolidButton
            size={"xl"}
            label={`Delete Account Permanently`}
            onPress={toggleDeleteProfileModal}
            customButtonStyle={{ backgroundColor: JASPER_CANE }}
            customTextStyle={{ color: BERN_RED }}
          />

          <VerticalSpace h={2} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  formContainer: { flex: 1, paddingHorizontal: widthRem * 4 },
  themeTextButton: {
    fontFamily: BERTIOGASANS_REGULAR,
    color: THEME,
    fontSize: screenRem * 1.2,
  },
  profileImageContainer: {
    width: screenRem * 10,
    height: screenRem * 10,
    borderRadius: screenRem * 5,
    overflow: "hidden",
    alignSelf: "center",
  },
  profileImage: {
    width: screenRem * 10,
    height: screenRem * 10,
    borderRadius: screenRem * 5,
  },
  addProfileImageButton: {
    backgroundColor: "#00000090",
    width: "100%",
    bottom: 0,
    position: "absolute",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  dangerZoneText: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.3,
    color: BLACK,
  },
  deleteProfileInfo: {
    fontFamily: BERTIOGASANS_REGULAR,
    color: FLINT_STONE,
    fontSize: screenRem * 1.1,
    lineHeight: screenRem * 1.8,
  },
});
