import React, { createRef, useCallback } from "react";
import { StyleSheet, Pressable, Text, View, Platform } from "react-native";
import { CurvedBottomBar } from "react-native-curved-bottom-bar";
import {
  Car,
  DirectUp,
  HambergerMenu,
  Home2,
  Routing,
} from "iconsax-react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, isNull } from "lodash";

import VerticalSpace from "../../components/VerticalSpace";
import DecisionModal from "../../components/Modals/DecisionModal";

import HomeStack from "../HomeStack";
import TripStack from "../TripStack";
import VehicleStack from "../VehicleStack";
import MenuStack from "../MenuStack";

import { FLINT_STONE, THEME, WHITE } from "../../constants/colors";
import { heightRem, screenRem } from "../../constants/dimensions";
import { BERTIOGASANS_REGULAR } from "../../constants/fonts";
import { clearTrip } from "../../redux/slices/trip/slice";
import useDisplayModal from "../../hooks/useDisplayModal";
import { isNotificationDot, setIsNotificationDot } from "../../redux/slices/notifications/slice";
import { DOT_MENU } from "../../assets/icons";

export const tabBarRef = createRef();

const ICON_SIZE = screenRem * 1.6;

const AppTabs = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [guestModal, toggleGuestModal] = useDisplayModal(false);
  const { auth } = useSelector((state) => state);
  const isNotificationRedDot = useSelector(isNotificationDot);

  let ISGUEST;

  ISGUEST = isEmpty(auth.user);
  ISGUEST = isNull(auth.refreshToken);

  const tabItem = ({ routeName, selectedTab, navigate }) => {

    const iconConfig = {
      Home: {
        icon: (
          <Home2
            size={ICON_SIZE}
            color={selectedTab === "Home" ? THEME : FLINT_STONE}
          />
        ),
        text: routeName,
      },
      Trip: {
        icon: (
          <DirectUp
            size={ICON_SIZE}
            color={selectedTab === "Trip" ? THEME : FLINT_STONE}
          />
        ),
        text: routeName === "Trip" ? "My Trips" : routeName,
      },
      Vehicle: {
        icon: (
          <Car
            size={ICON_SIZE}
            color={selectedTab === "Vehicle" ? THEME : FLINT_STONE}
          />
        ),
        text: routeName === "Vehicle" ? "My Vehicles" : routeName,
      },
      Menu: {
        icon: (
          isNotificationRedDot && selectedTab !== "Menu" ? <DOT_MENU /> :
            <HambergerMenu
              size={ICON_SIZE}
              color={selectedTab === "Menu" ? THEME : FLINT_STONE}
            />
        ),
        text: routeName,
      },
    };

    const { icon, text } = iconConfig[routeName] || {};

    const textStyles = {
      fontFamily: BERTIOGASANS_REGULAR,
      fontSize: screenRem,
      color: selectedTab === routeName ? THEME : FLINT_STONE,
    };

    const onTabBarItemPress = () => {
      if (ISGUEST && (routeName === "Vehicle" || routeName === "Trip")) {
        toggleGuestModal();
      } else if (routeName === "Menu") {
        dispatch(setIsNotificationDot(false))
        navigate(routeName);
      } else {
        navigate(routeName);
      }
    };

    return (
      <Pressable onPress={onTabBarItemPress} style={styles.tabBarItem}>
        {icon}
        <VerticalSpace h={0.6} />
        <Text style={textStyles}>{text}</Text>
      </Pressable>
    );
  };

  const tabCenterIcon = () => {
    return (
      <Pressable
        style={styles.circleButton}
        onPress={ISGUEST ? toggleGuestModal : goToPlanTrip}
      >
        <Routing size={screenRem * 2} color={WHITE} />
      </Pressable>
    );
  };

  const goToPlanTrip = useCallback(() => {
    dispatch(clearTrip());
    navigation.navigate("PlanTrip");
  }, [navigation]);

  const goToAccessAccount = useCallback(() => {
    navigation.navigate("AccessAccount");
  }, [navigation]);

  return (
    <View style={styles.container}>
      <DecisionModal
        isVisible={guestModal}
        label={`Create an Account or Login`}
        message={`Welcome to ezVOLTz. Would you like to create an account or log in to access additional features and personalize your experience?`}
        leftButtonText={`No`}
        rightButtonText={`Yes`}
        leftButtonPress={toggleGuestModal}
        rightButtonPress={() => {
          toggleGuestModal();
          goToAccessAccount();
        }}
        displayCloseButton={false}
      />
      <CurvedBottomBar.Navigator
        ref={tabBarRef}
        type="UP"
        bgColor={WHITE}
        initialRouteName="Home"
        renderCircle={tabCenterIcon}
        tabBar={tabItem}
        screenOptions={{ headerShown: false }}
      >
        <CurvedBottomBar.Screen
          name="Home"
          position="LEFT"
          component={HomeStack}
        />
        <CurvedBottomBar.Screen
          name="Trip"
          position="LEFT"
          component={TripStack}
        />
        <CurvedBottomBar.Screen
          name="Vehicle"
          position="RIGHT"
          component={VehicleStack}
        />
        <CurvedBottomBar.Screen
          name="Menu"
          position="RIGHT"
          component={MenuStack}

        />
      </CurvedBottomBar.Navigator>
    </View>
  );
};

export default AppTabs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Platform.OS === "ios" ? heightRem * 1.5 : 0,
    backgroundColor: WHITE,
  },
  tabBarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  circleButton: {
    width: screenRem * 5,
    height: screenRem * 5,
    backgroundColor: THEME,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: screenRem * 2.5,
    bottom: heightRem * 2,
  },
});
