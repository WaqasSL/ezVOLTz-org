import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PlanTripDetail from "../../screens/PlanTrip/PlanTripDetail";
import PlanTripPreview from "../../screens/PlanTrip/PlanTripPreview";

const Stack = createNativeStackNavigator();

const PlanTripStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={`PlanTripDetail`}
    >
      <Stack.Screen name="PlanTripDetail" component={PlanTripDetail} />
      <Stack.Screen name="PlanTripPreview" component={PlanTripPreview} />
    </Stack.Navigator>
  );
};

export default PlanTripStack;
