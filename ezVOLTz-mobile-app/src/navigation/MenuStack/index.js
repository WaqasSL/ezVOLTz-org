import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Menu from "../../screens/Menu";
import ContactUs from "../../screens/ContactUs";
import Feedback from "../../screens/Feedback";
import PaymentMethods from "../../screens/PaymentMethods";
import MyProfile from "../../screens/MyProfile";
import ChangePhone from "../../screens/ChangePhone";
import Password from "../../screens/Password";
import AppInfo from "../../screens/AppInfo";
import ChargingActivities from "../../screens/ChargingActivities";
import ChargingDetail from "../../screens/ChargingDetail";
import SaasFuelStationStopCharging from "../../screens/SaasFuelStationStopCharging";
import Notification from "../../screens/Notification";

import useTabBarVisibility from "../../hooks/useTabBarVisibility";

const Stack = createNativeStackNavigator();

const MenuStack = () => {
  useTabBarVisibility();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={`Menu`}
    >
      <Stack.Screen name="Menu" component={Menu} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="Feedback" component={Feedback} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="ChangePhone" component={ChangePhone} />
      <Stack.Screen name="Password" component={Password} />
      <Stack.Screen name="AppInfo" component={AppInfo} />
      <Stack.Screen name="ChargingActivities" component={ChargingActivities} />
      <Stack.Screen name="ChargingDetail" component={ChargingDetail} />
      <Stack.Screen
        name="SaasFuelStationStopCharging"
        component={SaasFuelStationStopCharging}
      />
      <Stack.Screen name="Notification" component={Notification} />
    </Stack.Navigator>
  );
};

export default MenuStack;
