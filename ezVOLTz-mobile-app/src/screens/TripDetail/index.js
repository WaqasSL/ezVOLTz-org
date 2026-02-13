import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import MapView, {PROVIDER_DEFAULT} from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  Clock,
  Copy,
  Edit,
  Flash,
  Location,
  Routing,
  Speedometer,
  Trash,
} from 'iconsax-react-native';
// import Dash from "react-native-dash";
import {useSelector} from 'react-redux';
import moment from 'moment';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isEmpty, isNull} from 'lodash';
import MapViewDirections from 'react-native-maps-directions';

import HorizontalSpace from '../../components/HorizontalSpace';
import VerticalSpace from '../../components/VerticalSpace';
import Line from '../../components/Line';
import VehicleCard from '../../components/Cards/VehicleCard';
import Loader from '../../components/Loader';
import RoundBackButton from '../../components/Buttons/RoundBackButton';
import Timer from './components/Timer';
import CustomMarker from '../../components/CustomMarker';
import SolidButton from '../../components/Buttons/SolidButton';
import HollowButton from '../../components/Buttons/HollowButton';

import {
  BERN_RED,
  BLACK,
  FLINT_STONE,
  JASPER_CANE,
  PINBALL,
  THEME,
  WHITE,
} from '../../constants/colors';
import {heightRem, screenRem, widthRem} from '../../constants/dimensions';
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
  BERTIOGASANS_SEMIBOLD,
} from '../../constants/fonts';
import useApiHook from '../../hooks/rest/useApi';
import {
  getRouteEvs,
  getStopsCoordinates,
  animateMapToRegion,
  showSnackSuccess,
} from '../../utils/functions';
import {GOOGLE_KEY} from '@env';
import useMapsNavigation from '../../hooks/useMapsNavigation';

const TripDetail = () => {
  const route = useRoute();
  const bottomSheetRef = useRef(null);
  const snapPointsIos = useMemo(() => ['30%', '70%'], []);
  const snapPointsAnd = useMemo(() => ['30%', '80%'], []);

  const {handleRestApi, restApiLoading} = useApiHook();
  const {auth} = useSelector(state => state);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const mapRef = useRef();
  const {initializeMapLoading, intializeMapNavigation} = useMapsNavigation();

  const USER_ID = auth?.user?._id;
  const {tripId, tripType} = route?.params;

  const [isSwipeUp, setIsSwipeUp] = useState(false);
  const [tripData, setTripData] = useState({});
  const [ev, setEv] = useState([]);
  const [stops, setStops] = useState([]);

  const handleSheetChange = useCallback(index => {
    if (index === 1) {
      setIsSwipeUp(true);
    } else {
      setIsSwipeUp(false);
    }
  }, []);

  const getTripDetail = async () => {
    const response = await handleRestApi({
      method: 'get',
      url: `trip/${USER_ID}/${tripId}`,
    });

    if (response?.status === 200) {
      setTripData(response?.data?.trip);
    }
  };

  const deleteTrip = async () => {
    const response = await handleRestApi({
      method: 'delete',
      url: `trip/${USER_ID}/${tripId}`,
    });

    if (response?.status === 200) {
      showSnackSuccess(response?.data?.message);
      goBack();
    }
  };

  const completeInprogressTrip = async () => {
    const response = await handleRestApi({
      method: 'get',
      url: `trip/stop/${USER_ID}/${tripData._id}`,
    });

    if (response.status === 200) {
      showSnackSuccess(response.data.message);
      goBack();
    }
  };

  const continueInprogressTrip = async () => {
    intializeMapNavigation(tripData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isEmpty(tripData)) {
          const [evResult, stopsResult] = await Promise.all([
            getRouteEvs({retry: false, tripData}),
            getStopsCoordinates(tripData),
          ]);

          setEv(evResult);
          setStops(stopsResult);
          animateMapToRegion(tripData, mapRef);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [tripData]);

  useEffect(() => {
    getTripDetail();
  }, []);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const goToUpdateTrip = useCallback(() => {
    navigation.navigate('UpdateTrip', {
      screen: 'UpdateTripDetail',
      params: {tripId},
    });
  }, [navigation]);

  const goToRescheduleTrip = useCallback(() => {
    navigation.navigate('RescheduleTrip', {
      screen: 'RescheduleTripDetail',
      params: {tripId},
    });
  }, [navigation]);

  function renderEvStations() {
    return ev?.fuel_stations?.map(station => {
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

      if (access_code === 'private') {
        return (
          <CustomMarker
            key={key}
            coordinate={{
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
            }}
            type={`private`}
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
          />
        );
      } else {
        return null;
      }
    });
  }

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      {restApiLoading || initializeMapLoading ? <Loader /> : null}

      <View style={styles.backButton(insets)}>
        <RoundBackButton onPress={goBack} />
      </View>

      {!isEmpty(tripData) && !restApiLoading && (
        <>
          <MapView
            provider={PROVIDER_DEFAULT}
            style={styles.map}
            scrollEnabled={true}
            ref={mapRef}
            rotateEnabled={false}>
            <CustomMarker
              coordinate={{
                latitude: tripData?.origin?.latitude,
                longitude: tripData?.origin?.longitude,
              }}
              zIndex={1}
              type={'pin'}
            />

            <CustomMarker
              coordinate={{
                latitude: tripData?.destination?.latitude,
                longitude: tripData?.destination?.longitude,
              }}
              zIndex={1}
              type={'pin'}
            />

            {!isEmpty(stops) &&
              stops?.map((stop, ind) => (
                <CustomMarker
                  key={`markerkey${ind}stop${stop?.latitude}`}
                  coordinate={{
                    latitude: stop.latitude,
                    longitude: stop.longitude,
                  }}
                  zIndex={1}
                  type={'pin'}
                />
              ))}

            {renderEvStations()}

            <MapViewDirections
              origin={{
                latitude: tripData?.origin?.latitude,
                longitude: tripData?.origin?.longitude,
              }}
              waypoints={
                tripData?.stops?.length > 0
                  ? tripData?.stops?.map(stop => stop.name)
                  : []
              }
              destination={{
                latitude: tripData?.destination?.latitude,
                longitude: tripData?.destination?.longitude,
              }}
              mode="DRIVING"
              apikey={GOOGLE_KEY}
              strokeColor={THEME}
              strokeWidth={5}
              avoidTolls={!isNull(tripData) && tripData.avoidTolls}
              avoidHighways={!isNull(tripData) && tripData.avoidHighways}
              avoidFerries={!isNull(tripData) && tripData.avoidTraffic}
            />
          </MapView>

          <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={Platform.OS === 'ios' ? snapPointsIos : snapPointsAnd}
            onChange={handleSheetChange}>
            <View style={styles.bottomSheetContainer}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                scrollEnabled={isSwipeUp}>
                <View style={styles.timeMenuContainer(tripType)}>
                  {tripType === 'upcoming' && (
                    <Timer
                      data={{
                        startDate: tripData?.startDate,
                        startTime: tripData?.startTime,
                      }}
                    />
                  )}

                  {tripData.status !== 'inprogress' && (
                    <View style={styles.actionButtonsContainer}>
                      <Pressable
                        style={{
                          ...styles.actionButton,
                          backgroundColor: THEME,
                        }}
                        onPress={
                          tripType === 'upcoming'
                            ? goToUpdateTrip
                            : goToRescheduleTrip
                        }>
                        <Copy size={screenRem * 1.2} color={WHITE} />
                        {/* <Edit size={screenRem * 1.4} color={WHITE} /> */}
                      </Pressable>

                      <HorizontalSpace w={2} />

                      <Pressable
                        style={{
                          ...styles.actionButton,
                          backgroundColor: BERN_RED,
                        }}
                        onPress={deleteTrip}>
                        <Trash size={screenRem * 1.4} color={WHITE} />
                      </Pressable>
                    </View>
                  )}
                </View>

                <VerticalSpace h={2} />

                <View>
                  <Text style={styles.tripToDestinationText}>
                    Trip to {tripData?.destination?.text}
                  </Text>

                  <VerticalSpace h={1} />

                  <Text style={styles.tripDateText}>
                    {!isNull(tripData?.startDate) &&
                      moment(tripData?.startDate).format('MMM DD , YYYY')}
                  </Text>
                </View>

                <VerticalSpace h={2} />

                <Line />

                <VerticalSpace h={2} />

                <View>
                  <View style={styles.row}>
                    <View style={styles.halfContainer}>
                      <View style={styles.labelContainer}>
                        <Routing size={screenRem * 2} color={THEME} />

                        <HorizontalSpace w={2} />

                        <Text style={styles.labelText}>Total Miles</Text>
                      </View>

                      <VerticalSpace h={2} />

                      <Text style={styles.quantityText}>
                        {tripData?.distance.replace(/m/, 'M')}
                      </Text>
                    </View>

                    <View style={styles.halfContainer}>
                      <View style={styles.labelContainer}>
                        <Clock size={screenRem * 2} color={THEME} />

                        <HorizontalSpace w={2} />

                        <Text style={styles.labelText}>Trip Time</Text>
                      </View>

                      <VerticalSpace h={2} />

                      <Text style={styles.quantityText}>{tripData?.time}</Text>
                    </View>
                  </View>

                  <VerticalSpace h={2} />

                  <View style={styles.row}>
                    <View style={styles.halfContainer}>
                      <View style={styles.labelContainer}>
                        <Flash size={screenRem * 2} color={THEME} />

                        <HorizontalSpace w={2} />

                        <Text style={styles.labelText}>Energy</Text>
                      </View>

                      <VerticalSpace h={2} />

                      <Text style={styles.quantityText}>
                        {tripData?.energy}
                      </Text>
                    </View>

                    <View style={styles.halfContainer}>
                      <View style={styles.labelContainer}>
                        <Speedometer size={screenRem * 2} color={THEME} />

                        <HorizontalSpace w={2} />

                        <Text style={styles.labelText}>Speed</Text>
                      </View>

                      <VerticalSpace h={2} />

                      <Text style={styles.quantityText}>{tripData?.speed}</Text>
                    </View>
                  </View>
                </View>

                <VerticalSpace h={2} />

                <Line />

                <VerticalSpace h={2} />

                <View>
                  <View style={styles.routeInfoContainer}>
                    <View style={styles.routeInfoLeftContainer}>
                      <View style={styles.originIcon} />
                    </View>

                    <Text style={styles.routeInfoText}>
                      {tripData?.origin?.text}
                    </Text>
                  </View>

                  <VerticalSpace h={0.1} />

                  <View style={styles.routeInfoContainer}>
                    <View style={styles.routeInfoLeftContainer}>
                      {/* <Dash
                        style={styles.dottedLine}
                        dashColor={PINBALL}
                        dashLength={4}
                        dashThickness={2}
                        dashGap={2}
                      /> */}

                      <VerticalSpace h={0.2} />
                    </View>
                  </View>

                  {tripData?.stops.length > 0 && (
                    <>
                      {tripData.stops.map((item, index) => (
                        <View key={index}>
                          <VerticalSpace h={0.1} />

                          <View style={styles.routeInfoContainer}>
                            <View style={styles.routeInfoLeftContainer}>
                              <View style={styles.stopsIcon} />
                            </View>

                            <Text style={styles.routeInfoText}>
                              {item.name}
                            </Text>
                          </View>

                          <VerticalSpace h={0.1} />

                          <View style={styles.routeInfoContainer}>
                            <View style={styles.routeInfoLeftContainer}>
                              {/* <Dash
                                style={styles.dottedLine}
                                dashColor={PINBALL}
                                dashLength={4}
                                dashThickness={2}
                                dashGap={2}
                              /> */}
                            </View>
                          </View>
                        </View>
                      ))}
                    </>
                  )}

                  <VerticalSpace h={0.1} />

                  <View style={styles.routeInfoContainer}>
                    <View style={styles.routeInfoLeftContainer}>
                      <Location size={screenRem * 1.6} color={BERN_RED} />
                    </View>

                    <Text style={styles.routeInfoText}>
                      {tripData?.destination?.text}
                    </Text>
                  </View>
                </View>

                <VerticalSpace h={2} />

                <Line />

                <VerticalSpace h={2} />

                <VehicleCard data={tripData?.vehicleId} />

                <VerticalSpace h={4} />

                {tripData.status === 'inprogress' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                    }}>
                    <HollowButton
                      label={`Continue`}
                      size={`md`}
                      onPress={continueInprogressTrip}
                    />
                    <HorizontalSpace w={4} />
                    <SolidButton
                      label={`Mark as Completed`}
                      size={`md`}
                      onPress={completeInprogressTrip}
                      customTextStyle={{fontSize: screenRem}}
                    />
                  </View>
                )}

                <VerticalSpace h={4} />
              </ScrollView>
            </View>
          </BottomSheet>
        </>
      )}
    </SafeAreaView>
  );
};

export default TripDetail;

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  backButton: insets => ({
    position: 'absolute',
    top: insets.top + heightRem,
    zIndex: 1,
    left: widthRem * 2,
  }),
  map: {flex: 1},
  bottomSheetContainer: {
    flex: 1,
    paddingHorizontal: widthRem * 4,
  },
  timeMenuContainer: tripType => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: tripType === 'upcoming' ? 'space-between' : 'flex-end',
  }),
  tripToDestinationText: {
    fontFamily: BERTIOGASANS_SEMIBOLD,
    fontSize: screenRem * 1.4,
    color: BLACK,
  },
  tripDateText: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem,
    color: FLINT_STONE,
  },
  row: {
    flexDirection: 'row',
  },
  halfContainer: {
    width: '50%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    fontFamily: BERTIOGASANS_REGULAR,
    color: FLINT_STONE,
    fontSize: screenRem * 1.1,
  },
  quantityText: {
    fontFamily: BERTIOGASANS_MEDIUM,
    color: BLACK,
    fontSize: screenRem * 1.3,
  },
  routeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeInfoLeftContainer: {
    width: widthRem * 8,
    alignItems: 'center',
  },
  originIcon: {
    height: screenRem,
    width: screenRem,
    borderRadius: screenRem,
    borderWidth: 1,
    borderColor: BLACK,
  },
  routeInfoText: {
    fontFamily: BERTIOGASANS_REGULAR,
    color: BLACK,
    fontSize: screenRem * 1.2,
  },
  dottedLine: {
    height: heightRem * 3,
    flexDirection: 'column',
  },
  stopsIcon: {
    height: screenRem * 0.8,
    width: screenRem * 0.8,
    borderRadius: screenRem,
    backgroundColor: JASPER_CANE,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    height: screenRem * 3,
    width: screenRem * 3,
    borderRadius: screenRem * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
