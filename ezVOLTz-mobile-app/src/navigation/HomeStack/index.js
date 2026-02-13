import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../../screens/Home";
import FuelStationDetail from "../../screens/FuelStationDetail";
import GetDirection from "../../screens/GetDirection";
import SaasFuelStationDetail from "../../screens/SaasFuelStationDetail";
import SaasConnectorDetail from "../../screens/SaasConnectorDetail";

import useTabBarVisibility from "../../hooks/useTabBarVisibility";

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  useTabBarVisibility();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={`Home`}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="FuelStationDetail" component={FuelStationDetail} />
      <Stack.Screen name="GetDirection" component={GetDirection} />
      <Stack.Screen
        name="SaasFuelStationDetail"
        component={SaasFuelStationDetail}
      />
      <Stack.Screen
        name="SaasConnectorDetail"
        component={SaasConnectorDetail}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
