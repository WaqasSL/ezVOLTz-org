import React, { useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";
import {
  Clock,
  DollarCircle,
  Flash,
  Routing2,
  Speedometer,
  InfoCircle,
} from "iconsax-react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import MapViewDirections from "react-native-maps-directions";
import useState from "react-usestateref";

import HorizontalSpace from "../../../components/HorizontalSpace";
import VerticalSpace from "../../../components/VerticalSpace";
import SolidButton from "../../../components/Buttons/SolidButton";
import HollowButton from "../../../components/Buttons/HollowButton";
import CustomMarker from "../../../components/CustomMarker";
import AddStopModal from "../../../components/Modals/AddStopModal";
import Loader from "../../../components/Loader";
import RangeHalo from "../../../components/RangeHalo";
import RangeHaloModal from "../../../components/Modals/RangeHaloModal";

import {
  heightRem,
  screenRem,
  width,
  widthRem,
} from "../../../constants/dimensions";
import {
  FLINT_STONE,
  FRIENDLY_BASILISK,
  PINBALL,
  THEME,
  WHITE,
  WHITE_SMOKE,
  WILD_DOVE,
} from "../../../constants/colors";
import { BERTIOGASANS_REGULAR } from "../../../constants/fonts";
import {
  setMapRegionAndFitToCoordinates,
  showSnackDanger,
  showSnackSuccess,
} from "../../../utils/functions";
import { GOOGLE_KEY } from "@env";
import { getRouteEvs_ } from "../../../utils/functions";
import useDisplayModal from "../../../hooks/useDisplayModal";
import { setTripFields, clearTrip } from "../../../redux/slices/trip/slice";
import useApiHook from "../../../hooks/rest/useApi";
import useCalculateRangeHalo from "../../../hooks/useCalculateRangeHalo";

const ICON_SIZE = screenRem * 1.6;

const RescheduleTripPreview = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { auth, trip } = useSelector((state) => state);
  const mapRef = useRef();
  const [addStopModal, toggleAddStopModal] = useDisplayModal(false);
  const [rangeHaloModal, toggleRangeHaloModal] = useDisplayModal(false);
  const dispatch = useDispatch();
  const { handleRestApi, restApiLoading } = useApiHook();
  const { radius, rangeHaloCoordinates, calculateRangeHalo, loadingRangeHalo } =
    useCalculateRangeHalo();

  const USER_ID = auth?.user?._id;

  const [initialRegion] = useState({
    latitude: trip.origin.latitude,
    longitude: trip.origin.longitude,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [evs, setEvs] = useState([]);
  const [_, setStationData, stationDataRef] = useState({});

  const getEvs = async () => {
    const { result, decodedPath } = await getRouteEvs_({ retry: false, trip });

    setEvs(result);

    calculateRangeHalo(
      decodedPath,
      trip.vehicle.range,
      trip.directions.distance,
      trip.origin
    );
  };

  const handleAddWaypoint = () => {
    toggleAddStopModal();

    if (trip.stops.length <= 7) {
      const stopsArray = [
        ...trip.stops,
        {
          id: `${new Date()?.toISOString()}${trip.stops.length}`,
          latitude: stationDataRef.current?.latitude,
          longitude: stationDataRef.current?.longitude,
          name: [
            stationDataRef.current?.street_address,
            stationDataRef.current?.city,
            stationDataRef.current?.state,
            stationDataRef.current?.country,
          ].join(", "),
          type: "waypoint",
        },
      ];

      const filteredWaypoints = Array.from(
        new Set(stopsArray.map((a) => a.name))
      ).map((name) => {
        return stopsArray.find((b) => b.name === name);
      });

      dispatch(setTripFields({ stops: filteredWaypoints }));

      showSnackSuccess("Waypoint added");
    } else {
      showSnackDanger("Maximum 8 waypoints are allowed");
    }
  };

  const handleSaveTrip = async () => {
    Keyboard.dismiss();

    let startTime = null;
    if (trip.date && trip.time) {
      let setStartTime = new Date(trip.time);
      setStartTime.setMonth(new Date(trip.date)?.getMonth());
      setStartTime.setFullYear(new Date(trip.date)?.getFullYear());
      setStartTime.setDate(new Date(trip.date)?.getDate());
      startTime = new Date(setStartTime);
    }

    const data = {
      origin: {
        text: trip.origin.name,
        latitude: trip.origin.latitude,
        longitude: trip.origin.longitude,
      },
      destination: {
        text: trip.destination.name,
        latitude: trip.destination.latitude,
        longitude: trip.destination.longitude,
      },
      stops: trip.stops.map((stop) => ({
        name: stop?.name,
        type: stop.type,
      })),
      chargersType: trip.availableChargers
        ? `availableChargers`
        : `allChargers`,
      connector: trip.connector.value,
      network: trip.network.value,
      distance: trip.directions.distance,
      time: trip.directions.timeDuration,
      speed: trip.directions.speed,
      energy: trip.directions.energy,
      cost: trip.directions.cost,
      vehicleId: trip.vehicle._id,
      avoidTolls: trip.avoidTolls,
      avoidHighways: trip.avoidHighways,
      startDate: trip.date
        ? new Date(trip.date) >= new Date()
          ? trip.date
          : new Date()
        : null,
      startTime: startTime
        ? new Date(startTime) >= new Date()
          ? startTime
          : new Date()
        : null,
    };

    const response = await handleRestApi({
      method: `post`,
      url: `trip/${USER_ID}`,
      data,
    });

    if (response.status === 201) {
      goToTrip();
      dispatch(clearTrip());
    }
  };

  useEffect(() => {
    setMapRegionAndFitToCoordinates(trip, mapRef);
    getEvs();
  }, []);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const goToTrip = useCallback(() => {
    navigation.navigate("Trip");
  }, [navigation]);

  function renderEvStations() {
    const handleMarkerPress = (station) => {
      setStationData(station);
      toggleAddStopModal();
    };

    return evs?.fuel_stations?.map((station) => {
      const {
        latitude,
        longitude,
        id,
        access_code,
        ev_level1_evse_num,
        ev_dc_fast_num,
        ev_level2_evse_num,
      } = station;
      const key = id;

      if (access_code === "private") {
        return (
          <CustomMarker
            key={key}
            coordinate={{
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
            }}
            type={`private`}
            onPress={() => handleMarkerPress(station)}
          />
        );
      } else if (ev_level1_evse_num) {
        return (
          <CustomMarker
            key={key}
            coordinate={{
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
            }}
            type={`level1`}
            onPress={() => handleMarkerPress(station)}
          />
        );
      } else if (ev_dc_fast_num) {
        return (
          <CustomMarker
            key={key}
            coordinate={{
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
            }}
            type={`dcfast`}
            onPress={() => handleMarkerPress(station)}
          />
        );
      } else if (ev_level2_evse_num) {
        return (
          <CustomMarker
            key={key}
            coordinate={{
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
            }}
            type={`level2`}
            onPress={() => handleMarkerPress(station)}
          />
        );
      } else {
        return null;
      }
    });
  }

  return (
    <View style={styles.container}>
      {loadingRangeHalo || restApiLoading ? <Loader /> : null}

      <RangeHaloModal
        isVisible={rangeHaloModal}
        closeModal={toggleRangeHaloModal}
        label={`Range Halo Info`}
      />

      <AddStopModal
        onCloseModal={toggleAddStopModal}
        isVisible={addStopModal}
        data={stationDataRef.current}
        getSelectedItem={handleAddWaypoint}
        label={`Charger Detail`}
      />

      <MapView
        ref={mapRef}
        initialRegion={initialRegion}
        provider={PROVIDER_DEFAULT}
        rotateEnabled={false}
        style={{ flex: 1 }}
      >
        {!loadingRangeHalo &&
          rangeHaloCoordinates.map((item, index) => (
            <RangeHalo key={index} coords={item} radius={1609.34 * radius} />
          ))}

        <CustomMarker
          coordinate={{
            latitude: trip.origin.latitude,
            longitude: trip.origin.longitude,
          }}
          zIndex={1}
          type={"pin"}
        />

        <CustomMarker
          coordinate={{
            latitude: trip.destination.latitude,
            longitude: trip.destination.longitude,
          }}
          zIndex={1}
          type={"pin"}
        />

        {trip.stops.map((stop, ind) => (
          <CustomMarker
            key={`markerkey${ind}stop${stop?.latitude}`}
            coordinate={{
              latitude: stop.latitude,
              longitude: stop.longitude,
            }}
            zIndex={1}
            type={"pin"}
          />
        ))}

        {renderEvStations()}

        <MapViewDirections
          origin={{
            latitude: trip.origin.latitude,
            longitude: trip.origin.longitude,
          }}
          waypoints={
            trip.stops.length > 0 ? trip.stops.map((stop) => stop.name) : []
          }
          destination={{
            latitude: trip.destination.latitude,
            longitude: trip.destination.longitude,
          }}
          mode="DRIVING"
          apikey={GOOGLE_KEY}
          strokeColor={THEME}
          strokeWidth={5}
          avoidTolls={trip.avoidTolls}
          avoidHighways={trip.avoidHighways}
        // avoidFerries={tripData.avoidTraffic}
        />
      </MapView>

      <View style={styles.detailsContainer(insets)}>
        <View style={styles.wrapView}>
          <View style={styles.infoContainer}>
            <Routing2 color={THEME} size={ICON_SIZE} />

            <HorizontalSpace w={2} />

            <Text style={styles.infoText}>{trip.directions.distance}</Text>
          </View>

          <HorizontalSpace w={4} />

          <View style={styles.infoContainer}>
            <Clock color={THEME} size={ICON_SIZE} />

            <HorizontalSpace w={2} />

            <Text style={styles.infoText}>{trip.directions.timeDuration}</Text>
          </View>

          <HorizontalSpace w={4} />

          <View style={styles.infoContainer}>
            <Flash color={THEME} size={ICON_SIZE} />

            <HorizontalSpace w={2} />

            <Text style={styles.infoText}>{trip.directions.energy}</Text>
          </View>

          <HorizontalSpace w={4} />

          <View style={styles.infoContainer}>
            <DollarCircle color={THEME} size={ICON_SIZE} />

            <HorizontalSpace w={2} />

            <Text style={styles.infoText}>{trip.directions.cost}</Text>
          </View>

          <HorizontalSpace w={4} />

          <View style={styles.infoContainer}>
            <Speedometer color={THEME} size={ICON_SIZE} />

            <HorizontalSpace w={2} />

            <Text style={styles.infoText}>{trip.directions.speed}</Text>
          </View>

          <HorizontalSpace w={4} />

          <View style={styles.rangeHaloContainer}>
            <View style={styles.infoContainer}>
              <View style={styles.rangeHalo} />

              <HorizontalSpace w={2} />

              <Text style={styles.infoText}>Range Halo</Text>
            </View>

            <HorizontalSpace w={2} />

            <TouchableOpacity onPress={toggleRangeHaloModal}>
              <InfoCircle color={WILD_DOVE} size={screenRem * 1.4} />
            </TouchableOpacity>
          </View>
        </View>

        <VerticalSpace h={2} />

        <Text style={styles.calculationText}>
          Above calculations are based on past user data. Factors such as
          weather, speed, traffic & jurisdictional charges impact our estimates.
        </Text>

        <VerticalSpace h={2} />

        <View style={styles.buttonsContainer}>
          <HollowButton
            label={`Change Trip`}
            size={`md`}
            customTextStyle={{ color: FLINT_STONE }}
            customButtonStyle={{ borderColor: PINBALL }}
            onPress={goBack}
          />
          <SolidButton
            label={`Save Trip`}
            size={`md`}
            onPress={handleSaveTrip}
          />
        </View>
        <VerticalSpace h={2} />

      </View>
    </View>
  );
};

export default RescheduleTripPreview;

const styles = StyleSheet.create({
  container: { flex: 1 },
  detailsContainer: (insets) => ({
    backgroundColor: WHITE,
    position: "absolute",
    zIndex: 1,
    bottom: 0,
    width: width,
    paddingBottom: insets.bottom + heightRem,
    paddingTop: heightRem * 2,
    justifyContent: "flex-end",
    paddingHorizontal: widthRem * 6,
    borderTopRightRadius: screenRem * 2,
    borderTopLeftRadius: screenRem * 2,
    borderWidth: 1,
    borderColor: WHITE_SMOKE,
  }),
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: heightRem,
  },
  infoText: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.1,
  },
  rangeHalo: {
    height: screenRem * 1.8,
    width: screenRem * 1.8,
    backgroundColor: FRIENDLY_BASILISK,
    borderRadius: width,
    borderWidth: 1,
    borderColor: THEME,
  },
  wrapView: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  calculationText: {
    color: FLINT_STONE,
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.1,
    lineHeight: screenRem * 1.4,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: widthRem * 4,
  },
  rangeHaloContainer: { flexDirection: "row", alignItems: "center" },
});
