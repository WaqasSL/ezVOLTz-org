import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {StatusBar} from 'react-native';

import OnboardingSecondary from '../../screens/OnboardingSecondary';
import AccessAccount from '../../screens/AccessAccount';
import VerifyEmail from '../../screens/VerifyEmail';
import PersonalInformation from '../../screens/PersonalInformation';
import ForgotPassword from '../../screens/ForgotPassword';
import ProfileCreationSuccess from '../../screens/ProfileCreationSuccess';

import AppTabs from '../AppTabs';
import PlanTripStack from '../PlanTripStack';
import AddVehicle from '../../screens/AddVehicle';
import EditVehicle from '../../screens/EditVehicle';
import UpdateTripStack from '../UpdateTripStack';
import RescheduleTripStack from '../RescheduleTripStack';
import {WHITE, THEME} from '../../constants/colors';
import {useNavigation} from '@react-navigation/native';
import OnboardingInitial from '../../screens/OnboardingInitial/index';

const Stack = createNativeStackNavigator();

const AuthenticationStack = () => {
  const {auth} = useSelector(state => state);

  const INITIALROUTE = auth.displayOnboarding ? `OnboardingInitial` : `AppTabs`;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={INITIALROUTE}>
      <Stack.Screen name="OnboardingInitial" component={OnboardingInitial} />
      <Stack.Screen
        name="OnboardingSecondary"
        component={OnboardingSecondary}
      />
      <Stack.Screen name="AccessAccount" component={AccessAccount} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
      <Stack.Screen
        name="PersonalInformation"
        component={PersonalInformation}
      />
      <Stack.Screen
        name="ProfileCreationSuccess"
        component={ProfileCreationSuccess}
      />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

      <Stack.Screen name="AppTabs" component={AppTabs} />
      <Stack.Screen name="PlanTrip" component={PlanTripStack} />
      <Stack.Screen name="UpdateTrip" component={UpdateTripStack} />
      <Stack.Screen name="RescheduleTrip" component={RescheduleTripStack} />
      <Stack.Screen name="AddVehicle" component={AddVehicle} />
      <Stack.Screen name="EditVehicle" component={EditVehicle} />
    </Stack.Navigator>
  );
};

export default AuthenticationStack;
