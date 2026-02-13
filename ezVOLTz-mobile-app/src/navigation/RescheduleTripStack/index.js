import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RescheduleTripDetail from "../../screens/RescheduleTrip/RescheduleTripDetail";
import RescheduleTripPreview from "../../screens/RescheduleTrip/RescheduleTripPreview";

const Stack = createNativeStackNavigator();

const RescheduleTripStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={`RescheduleTripDetail`}
    >
      <Stack.Screen
        name="RescheduleTripDetail"
        component={RescheduleTripDetail}
      />
      <Stack.Screen
        name="RescheduleTripPreview"
        component={RescheduleTripPreview}
      />
    </Stack.Navigator>
  );
};

export default RescheduleTripStack;
