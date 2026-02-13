import {useState} from 'react';
import {Platform, Linking, Alert} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

import Geocoder from 'react-native-geocoding';
import {GOOGLE_KEY} from '@env';

Geocoder.init(GOOGLE_KEY);

const useLocationServices = () => {
  const [location, setLocation] = useState({});

  const requestUserCurrentLocation = async () => {
    try {
      if (Platform.OS === 'ios') {
        await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
          .then(result => {
            switch (result) {
              case RESULTS.UNAVAILABLE:
              case RESULTS.DENIED:
                Geolocation.requestAuthorization();
                break;
              case RESULTS.LIMITED:
              case RESULTS.GRANTED:
                getCurrentLocation();
                break;
              case RESULTS.BLOCKED:
                displayLocationPermissionAlert(
                  'Location permission is blocked in the device settings. Allow the app to access location.',
                );
                break;
            }
          })
          .catch(error => {
            console.error('Permission check error (iOS):', error);
          });
      } else {
        await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
          .then(result => {
            switch (result) {
              case RESULTS.UNAVAILABLE:
                displayLocationPermissionAlert(
                  'Location permission is denied. Allow the app to access location.',
                );
                break;
              case RESULTS.DENIED:
                setTimeout(() => {
                  request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(
                    result => {
                      if (result === 'granted') {
                        getCurrentLocation();
                      }
                    },
                  );
                }, 1000);
                break;
              case RESULTS.LIMITED:
                getCurrentLocation();
                break;
              case RESULTS.GRANTED:
                getCurrentLocation();
                break;
              case RESULTS.BLOCKED:
                displayLocationPermissionAlert(
                  'Location permission is blocked in the device settings. Allow the app to access location.',
                );
                break;
            }
          })
          .catch(error => {});
      }

      //   await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      //     .then((result) => {
      //       switch (result) {
      //         case RESULTS.UNAVAILABLE:
      //         case RESULTS.DENIED:
      //           displayLocationPermissionAlert(
      //             "Location permission is denied. Allow the app to access location.",
      //           );
      //           break;
      //         case RESULTS.LIMITED:
      //         case RESULTS.GRANTED:
      //           getCurrentLocation();
      //           break;
      //         case RESULTS.BLOCKED:
      //           displayLocationPermissionAlert(
      //             "Location permission is blocked in the device settings. Allow the app to access location.",
      //           );
      //           break;
      //       }
      //     })
      //     .catch((error) => {});
      // }
    } catch (error) {
      console.log('error', error);
    }
  };

  const displayLocationPermissionAlert = message => {
    Alert.alert('Location permission', message, [
      {cancelable: true, text: 'Cancel'},
      {
        cancelable: true,
        text: 'OK',
        onPress: () => {
          const settingsIntent =
            Platform.OS === 'android'
              ? 'android.settings.LOCATION_SOURCE_SETTINGS'
              : 'app-settings:';
          Linking.openSettings().catch(() =>
            Linking.sendIntent(settingsIntent),
          );
        },
      },
    ]);
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async res => {
        try {
          const json = await Geocoder.from(
            res?.coords?.latitude,
            res?.coords?.longitude,
          );

          setLocation({
            longitude: json.results[0].geometry.location.lng,
            latitude: json.results[0].geometry.location.lat,
            name: json.results[0].formatted_address,
          });
        } catch (error) {
          console.log('==>>', error);
        }
      },
      error => {
        if (error.code === 2) {
          console.log(error);
          displayLocationPermissionAlert(
            'GPS on your device is disabled. Please enable it for accurate location services.',
          );
        }
      },
    );
  };

  return {location, requestUserCurrentLocation};
};

export default useLocationServices;
