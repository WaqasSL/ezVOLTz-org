import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MyVehicles from "../../screens/MyVehicles";

const Stack = createNativeStackNavigator();

const VehicleStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={`MyVehicles`}
    >
      <Stack.Screen name="MyVehicles" component={MyVehicles} />
    </Stack.Navigator>
  );
};

export default VehicleStack;
