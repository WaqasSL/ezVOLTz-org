import React, { useCallback, useEffect } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Arrow, Clock, Location } from "iconsax-react-native";
import { useNavigation } from "@react-navigation/native";
import { isEmpty } from "lodash";
import { useSelector } from "react-redux";

import VerticalSpace from "../../../components/VerticalSpace";
import HorizontalSpace from "../../../components/HorizontalSpace";

import {
  heightRem,
  screenRem,
  width,
  widthRem,
} from "../../../constants/dimensions";
import {
  JASPER_CANE,
  THEME,
  WHITE,
  BLACK,
  FLINT_STONE,
} from "../../../constants/colors";
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../../constants/fonts";
import useLocationServices from "../../../hooks/useLocationServices";

const NRELCard = ({ data }) => {
  const navigation = useNavigation();
  const { location, requestUserCurrentLocation } = useLocationServices();

  const { filter } = useSelector((state) => state);

  const chargerType = data.ev_level1_evse_num
    ? "Level 1"
    : data.ev_dc_fast_num
    ? "DC Fast"
    : data.ev_level2_evse_num
    ? "Level 2"
    : data.access_code === "private"
    ? "Private"
    : "N/A";

  useEffect(() => {
    if (!isEmpty(location)) {
      goToGetDirection(location);
    }
  }, [location]);

  const goToFuelStationDetail = useCallback(
    (data) => {
      navigation.navigate(`FuelStationDetail`, {
        stationData: data,
      });
    },
    [navigation],
  );

  const goToGetDirection = useCallback(
    (location) => {
      navigation.navigate(`GetDirection`, {
        locationUser: location,
        locationFuelStation: {
          latitude: data.latitude,
          longitude: data.longitude,
        },
      });
    },
    [navigation],
  );

  if (
    !data ||
    (data.access_code !== "private" &&
      !(filter.incAc1 && data.ev_level1_evse_num) &&
      !(filter.incDc && data.ev_dc_fast_num) &&
      !(filter.incAc2 && data.ev_level2_evse_num))
  ) {
    return null;
  }

  return (
    <Pressable
      style={styles.container}
      onPress={() => goToFuelStationDetail(data)}
    >
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>{data.station_name}</Text>

        <Pressable
          style={styles.navigationButton}
          onPress={requestUserCurrentLocation}
        >
          <Arrow size={screenRem * 1.6} color={THEME} />
        </Pressable>
      </View>

      <VerticalSpace h={0.5} />

      <View style={styles.infoContainer}>
        <Location color={BLACK} size={screenRem * 1.6} />

        <HorizontalSpace w={2} />

        <Text style={styles.info}>
          {data.street_address}, {data.city}, {data.state}, {data.state},{" "}
          {data.country}
        </Text>
      </View>

      <VerticalSpace h={1} />

      <View style={styles.infoContainer}>
        <Clock color={BLACK} size={screenRem * 1.6} />
        <HorizontalSpace w={2} />
        <Text style={styles.info}>
          {Math.round(data.distance_km * 10) / 10} km Away
        </Text>
      </View>

      <VerticalSpace h={1} />

      <View style={styles.chargerTypeContainer}>
        <Text style={styles.chargerType}>{chargerType}</Text>
      </View>
    </Pressable>
  );
};

export default NRELCard;

const styles = StyleSheet.create({
  container: {
    width: widthRem * 92,
    paddingHorizontal: widthRem * 6,
    paddingVertical: heightRem * 1.4,
    backgroundColor: WHITE,
    alignSelf: "center",
    borderRadius: screenRem * 2,
    borderWidth: 1,
    borderColor: JASPER_CANE,
    marginVertical: heightRem,
  },
  headingContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heading: {
    color: BLACK,
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.2,
    width: `80%`,
  },
  navigationButton: {
    padding: screenRem * 0.6,
    borderRadius: width,
    borderWidth: 1,
    borderColor: THEME,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    color: FLINT_STONE,
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem,
    lineHeight: 16,
    width: widthRem * 70,
  },
  chargerTypeContainer: {
    backgroundColor: JASPER_CANE,
    width: widthRem * 16,
    paddingVertical: heightRem,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: widthRem,
  },
  chargerType: {
    color: FLINT_STONE,
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem,
    textTransform: "capitalize",
  },
});
