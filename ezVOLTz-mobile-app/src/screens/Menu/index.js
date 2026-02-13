import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Cards,
  DocumentText,
  Flash,
  InfoCircle,
  LikeDislike,
  MessageQuestion,
  MobileProgramming,
  Notification,
  ShieldTick,
  User,
} from "iconsax-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, isNull } from "lodash";
import useState from "react-usestateref";
import VerticalSpace from "../../components/VerticalSpace";
import GuestProfileCard from "../../components/Cards/GuestProfileCard";
import MenuCard from "../../components/Cards/MenuCard";
import Line from "../../components/Line";
import VerifiedUserProfileCard from "../../components/Cards/VerifiedUserProfileCard";

import {
  BERN_RED,
  FLINT_STONE,
  FLINT_STONE_LIGHT,
  THEME,
  WHITE,
  WHITE_SMOKE,
  WILD_DOVE,
} from "../../constants/colors";
import {
  heightRem,
  screenRem,
  width,
  widthRem,
} from "../../constants/dimensions";
import { formatCounts, openURL } from "../../utils/functions";
import { setAuthFields } from "../../redux/slices/auth/slice";
import { BERTIOGASANS_REGULAR } from "../../constants/fonts";
import useApiHook from "../../hooks/rest/useApi";
import {
  isNotificationDot,
  setIsNotificationDot,
  setNotificationsFields,
} from "../../redux/slices/notifications/slice";
import { NEW_NOTIFICATION } from "../../assets/icons";
import { EZVOLTZ_LOGO_SECONDARY } from "../../constants/svg";
import { setSaasChargeDetails } from "../../redux/slices/saasCharge/slice";

const ICON_COLOR_ACTIVE = FLINT_STONE;
const ICON_COLOR_INACTIVE = FLINT_STONE_LIGHT;
const ICON_SIZE = screenRem * 1.4;

const Menu = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const { handleRestApi } = useApiHook();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { auth, notifications } = useSelector((state) => state);
  const isNotificationRedDot = useSelector(isNotificationDot);
  const dispatch = useDispatch();

  let ISGUEST;

  ISGUEST = isEmpty(auth.user);
  ISGUEST = isNull(auth.refreshToken);

  const onSignOut = () => {
    dispatch(
      setAuthFields({
        user: {},
        accessToken: null,
        refreshToken: null,
        displayOnboarding: false,
      }),
    );
    dispatch(setSaasChargeDetails(null));
  };

  const getAllNotifications = async () => {
    const response = await handleRestApi({
      method: `get`,
      url: `notifications/all?page=1&limit=10`,
    });

    if (response.status === 200) {
      dispatch(
        setNotificationsFields({
          notificationsList: response.data.notifications,
          count: response.data.count,
          notReadNotificationsCount: response?.data?.notReadCount,
        }),
      );
    }
  };

  useEffect(() => {
    if (!ISGUEST) {
      getAllNotifications();
    }
  }, [ISGUEST]);

  const goToAccessAccount = useCallback(() => {
    navigation.navigate(`AccessAccount`);
  }, [navigation]);

  const goToPersonalInformation = useCallback(() => {
    navigation.navigate(`PersonalInformation`);
  }, [navigation]);

  const goToContactUs = useCallback(() => {
    navigation.navigate(`ContactUs`);
  }, [navigation]);

  const goToFeedback = useCallback(() => {
    navigation.navigate(`Feedback`);
  }, [navigation]);

  const goToPaymentMethods = useCallback(() => {
    navigation.navigate(`PaymentMethods`);
  }, [navigation]);

  const goToMyProfile = useCallback(() => {
    navigation.navigate(`MyProfile`);
  }, [navigation]);

  const goToAppInfo = useCallback(() => {
    navigation.navigate(`AppInfo`);
  }, [navigation]);

  const goToChargingActivities = useCallback(() => {
    navigation.navigate(`ChargingActivities`);
  }, [navigation]);

  const goToNotification = useCallback(() => {
    dispatch(setIsNotificationDot(false));
    navigation.navigate(`Notification`);
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: WHITE,
        paddingTop: insets.top,
        paddingBottom: tabBarHeight,
        paddingHorizontal: widthRem * 4,
      }}
    >
      <View style={styles.appLogoContainer}>
        <EZVOLTZ_LOGO_SECONDARY />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VerticalSpace h={2} />

        {ISGUEST ? (
          <GuestProfileCard
            onAccessAccountPress={goToAccessAccount}
            onPersonalInformationPress={goToPersonalInformation}
          />
        ) : (
          <VerifiedUserProfileCard onSignOutPress={onSignOut} />
        )}

        <VerticalSpace h={4} />

        <MenuCard
          icon={
            <User
              color={ISGUEST ? ICON_COLOR_INACTIVE : ICON_COLOR_ACTIVE}
              size={ICON_SIZE}
            />
          }
          label={`View Profile`}
          loginRequired={ISGUEST}
          onPress={goToMyProfile}
          disabled={ISGUEST}
        />

        <MenuCard
          icon={
            <Cards
              color={ISGUEST ? ICON_COLOR_INACTIVE : ICON_COLOR_ACTIVE}
              size={ICON_SIZE}
            />
          }
          label={`Payment Methods`}
          loginRequired={ISGUEST}
          onPress={goToPaymentMethods}
        />

        <MenuCard
          icon={
            <Flash
              color={ISGUEST ? ICON_COLOR_INACTIVE : ICON_COLOR_ACTIVE}
              size={ICON_SIZE}
            />
          }
          label={`Charging History`}
          loginRequired={ISGUEST}
          onPress={goToChargingActivities}
        />
        {ISGUEST ? null : (
          <MenuCard
            icon={
              isNotificationRedDot ? (
                <NEW_NOTIFICATION
                  size={ICON_SIZE}
                  color={ISGUEST ? ICON_COLOR_INACTIVE : ICON_COLOR_ACTIVE}
                />
              ) : (
                <Notification
                  color={ISGUEST ? ICON_COLOR_INACTIVE : ICON_COLOR_ACTIVE}
                  size={ICON_SIZE}
                />
              )
            }
            // icon={
            //   <Notification
            //     color={ISGUEST ? ICON_COLOR_INACTIVE : ICON_COLOR_ACTIVE}
            //     size={ICON_SIZE}
            //   />
            // }
            label={`Notifications`}
            loginRequired={ISGUEST}
            onPress={goToNotification}
            beforeRight={
              notifications?.notReadNotificationsCount > 0 && (
                <View style={styles.unReadCountContainer}>
                  <Text style={styles.unReadCountText}>
                    {formatCounts(notifications?.notReadNotificationsCount)}
                  </Text>
                </View>
              )
            }
          />
        )}

        <VerticalSpace h={1} />

        <Line />

        <VerticalSpace h={2} />

        <MenuCard
          icon={<InfoCircle color={ICON_COLOR_ACTIVE} size={ICON_SIZE} />}
          label={`About Us`}
          onPress={() => openURL(`http://www.ezvoltz.com/about-us/`)}
        />

        <VerticalSpace h={1} />

        <MenuCard
          icon={<MessageQuestion color={ICON_COLOR_ACTIVE} size={ICON_SIZE} />}
          label={`Contact Us`}
          onPress={goToContactUs}
        />

        <VerticalSpace h={1} />

        <MenuCard
          icon={<LikeDislike color={ICON_COLOR_ACTIVE} size={ICON_SIZE} />}
          label={`Feedback`}
          onPress={goToFeedback}
        />

        <VerticalSpace h={1} />

        <MenuCard
          icon={<ShieldTick color={ICON_COLOR_ACTIVE} size={ICON_SIZE} />}
          label={`Privacy Policy`}
          onPress={() => openURL(`https://www.ezvoltz.app/privacy-policy`)}
        />

        <VerticalSpace h={1} />

        <MenuCard
          icon={<DocumentText color={ICON_COLOR_ACTIVE} size={ICON_SIZE} />}
          label={`Term & Conditions`}
          onPress={() =>
            openURL(`https://www.ezvoltz.app/terms-and-conditions`)
          }
        />

        <VerticalSpace h={1} />

        <MenuCard
          icon={
            <MobileProgramming color={ICON_COLOR_ACTIVE} size={ICON_SIZE} />
          }
          label={`App Info`}
          onPress={goToAppInfo}
        />

        <VerticalSpace h={6} />

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>VERSION 1.0.0(42)</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  appVersion: {
    fontFamily: BERTIOGASANS_REGULAR,
    color: THEME,
    fontSize: screenRem * 1.4,
    opacity: 0.6,
  },
  appLogoContainer: { marginVertical: heightRem, alignItems: "center" },
  versionContainer: { alignItems: "center", marginBottom: heightRem * 8 },
  versionText: {
    fontSize: screenRem,
    color: FLINT_STONE,
    fontFamily: BERTIOGASANS_REGULAR,
  },

  unReadCountContainer: {
    backgroundColor: BERN_RED,
    paddingHorizontal: screenRem * 0.6,
    paddingVertical: screenRem * 0.2,
    borderRadius: screenRem * 100,
    justifyContent: "center",
    alignItems: "center",
    marginRight: widthRem * 2,
  },
  unReadCountText: {
    color: WHITE,
    // fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.1,
  },
});
