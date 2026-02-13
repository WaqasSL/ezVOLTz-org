import React, {useEffect, useState} from 'react';
import {LogBox, Platform, StatusBar} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';
import {StripeProvider} from '@stripe/stripe-react-native';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import * as Sentry from '@sentry/react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import NetworkLogger from 'react-native-network-logger';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import AppNavigation from './src/navigation/AppNavigation';

import NoInternetConnection from './src/components/NoInternetConnection';
import Gif from './src/components/Gif';

import {store, persistor} from './src/redux/store';
import {
  STRIPE_PUBLISH_KEY,
  MERCHANT_ID,
  SENTRY_DNS,
  GOOGLE_WEB_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
} from '@env';
import useInternetStatus from './src/hooks/useInternetStatus';
import {WHITE} from './src/constants/colors';
import moment from 'moment';

Sentry.init({
  dsn: SENTRY_DNS,
});

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  iosClientId: GOOGLE_IOS_CLIENT_ID,
});

LogBox.ignoreAllLogs();

const App = () => {
  const {isInternetConnected} = useInternetStatus();
  const [displayIosSplash, setDisplayIosSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hide();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      const timer = setTimeout(() => {
        setDisplayIosSplash(!displayIosSplash);
      }, 4000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, []);

  moment.updateLocale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s ago',
      s: 'few seconds ago',
      ss: '%d seconds ago',
      m: '1 minute ago',
      mm: 'few minutes ago',
      h: '1 hour ago',
      hh: '%d hours ago',
      d: '1 day ago',
      dd: '%d days ago',
      w: '1 week ago',
      ww: '%d weeks ago',
      M: '1 month ago',
      MM: '%d months ago',
      y: '1 year ago',
      yy: '%d years ago',
    },
  });

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <BottomSheetModalProvider>
          <Provider store={store}>
            <PersistGate
              // loading={<Text>Loading...</Text>}
              persistor={persistor}>
              <StatusBar backgroundColor={WHITE} barStyle="dark-content" />

              <StripeProvider
                publishableKey={STRIPE_PUBLISH_KEY}
                merchantIdentifier={MERCHANT_ID}>
                {displayIosSplash && Platform.OS === 'ios' ? (
                  <Gif />
                ) : isInternetConnected.isConnected ? (
                  <AppNavigation />
                ) : (
                  <NoInternetConnection
                    isInternetConnected={isInternetConnected}
                  />
                )}
              </StripeProvider>
            </PersistGate>
          </Provider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;

//library
//components
//screens
//constants

// const [passwordVisibility, setPasswordVisibility] = useState({
//   showPassword: false,
//   showConfirmPassword: false,
// });

// const togglePasswordVisibility = (field) => {
//   setPasswordVisibility((prevVisibility) => ({
//     ...prevVisibility,
//     [field]: !prevVisibility[field],
//   }));
// };

// const goToPersonalInformation = useCallback(() => {
//   navigation.navigate(`PersonalInformation`);
// }, [navigation]);

// import { useSafeAreaInsets } from "react-native-safe-area-context";

// useEffect(() => {
//   if (!isEmpty(filter.location)) {
//     animateToRegion();
//     handleFuelStations();
//   }
// }, [filter.location]);

// useEffect(() => {
//   if (!listView) {
//     animateToRegion();
//   }
// }, [listView]);

// useEffect(() => {
//   if (hasSelectRadiusRef.current) {
//     handleFuelStations();
//   }
// }, [filter.radius, hasSelectRadiusRef.current]);
