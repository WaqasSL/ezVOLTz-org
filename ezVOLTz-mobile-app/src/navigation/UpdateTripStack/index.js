import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import UpdateTripDetail from "../../screens/UpdateTrip/UpdateTripDetail";
import UpdateTripPreview from "../../screens/UpdateTrip/UpdateTripPreview";

const Stack = createNativeStackNavigator();

const UpdateTripStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={`UpdateTripDetail`}
    >
      <Stack.Screen name="UpdateTripDetail" component={UpdateTripDetail} />
      <Stack.Screen name="UpdateTripPreview" component={UpdateTripPreview} />
    </Stack.Navigator>
  );
};

export default UpdateTripStack;
