import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MyTrips from "../../screens/MyTrips";
import TripDetail from "../../screens/TripDetail";

import useTabBarVisibility from "../../hooks/useTabBarVisibility";

const Stack = createNativeStackNavigator();

const TripStack = () => {
  useTabBarVisibility();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={`MyTrips`}
    >
      <Stack.Screen name="MyTrips" component={MyTrips} />
      <Stack.Screen name="TripDetail" component={TripDetail} />
    </Stack.Navigator>
  );
};

export default TripStack;
