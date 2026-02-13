import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomMarker from "../../components/CustomMarker";
import SolidButton from "../../components/Buttons/SolidButton";
import RoundBackButton from "../../components/Buttons/RoundBackButton";

import { GOOGLE_KEY } from "@env";
import { THEME, WHITE } from "../../constants/colors";
import { heightRem, screenRem, widthRem } from "../../constants/dimensions";
import { BERTIOGASANS_MEDIUM } from "../../constants/fonts";
import { showSnackDanger, navigateToMap } from "../../utils/functions";

const GetDirection = () => {
  const { params } = useRoute();
  const mapRef = useRef();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const animateToRegion = () => {
    mapRef.current?.animateToRegion(
      {
        longitude: params.locationUser.longitude,
        latitude: params.locationUser.latitude,
        latitudeDelta: 1.5922,
        longitudeDelta: 1.3421,
      },
      1000
    );
  };

  useEffect(() => {
    animateToRegion();
  }, []);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.backButton(insets)}>
        <RoundBackButton onPress={goBack} />
      </View>

      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        rotateEnabled={false}
        style={{ flex: 1 }}
      >
        <CustomMarker
          coordinate={{
            longitude: params.locationUser.longitude,
            latitude: params.locationUser.latitude,
          }}
          type={`pin`}
        />

        <CustomMarker
          coordinate={{
            longitude: params.locationFuelStation.longitude,
            latitude: params.locationFuelStation.latitude,
          }}
          type={`pin`}
        />

        <MapViewDirections
          origin={{
            latitude: params.locationUser.latitude,
            longitude: params.locationUser.longitude,
          }}
          destination={{
            latitude: params.locationFuelStation.latitude,
            longitude: params.locationFuelStation.longitude,
          }}
          mode="DRIVING"
          apikey={GOOGLE_KEY}
          strokeColor={THEME}
          strokeWidth={5}
          onError={() => showSnackDanger(`No route found`)}
        />
      </MapView>

      <SolidButton
        label={`Navigate`}
        customButtonStyle={styles.customButtonStyle(insets)}
        size={"xl"}
        onPress={() =>
          navigateToMap(params.locationUser, params.locationFuelStation)
        }
      />
    </View>
  );
};

export default GetDirection;

const styles = StyleSheet.create({
  container: { flex: 1 },
  navigateButton: (insets) => ({
    position: "absolute",
    zIndex: 1,
    top: insets.top + heightRem * 2,
    right: widthRem * 4,
    backgroundColor: THEME,
    paddingHorizontal: widthRem * 6,
    paddingVertical: heightRem,
  }),
  navigateButtonText: {
    fontFamily: BERTIOGASANS_MEDIUM,
    color: WHITE,
    fontSize: screenRem * 1.2,
  },
  customButtonStyle: (insets) => ({
    bottom: insets.bottom + heightRem * 2,
    position: "absolute",
    alignSelf: "center",
  }),
  backButton: (insets) => ({
    position: "absolute",
    zIndex: 1,
    marginLeft: widthRem * 4,
    marginTop: insets.top + heightRem * 2,
  }),
});
