import React, {Fragment, useCallback, useEffect, useMemo, useRef} from 'react';
import {
  AppState,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, {PROVIDER_DEFAULT} from 'react-native-maps';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {isEmpty, isNull, isUndefined} from 'lodash';
import useState from 'react-usestateref';
import {useNavigation} from '@react-navigation/native';

import NRELCard from '../../components/Cards/NRELCard';

import MapLegendModal from '../../components/Modals/MapLegendModal';
import HomeHeader from '../../components/Headers/HomeHeader';
import FilterModal from '../../components/Modals/FilterModal';
import RadiusModal from '../../components/Modals/RadiusModal';
import GooglePlacesAutocompleteModal from '../../components/Modals/GooglePlacesAutocompleteModal';
import Loader from '../../components/Loader';
import CustomMarker from '../../components/CustomMarker';
import DecisionModal from '../../components/Modals/DecisionModal';
import SAASCard from '../../components/Cards/SAASCard';
import AdBannerSecondary from '../../components/Ads/AdBannerSecondary';

import {BLACK, WHITE, WHITE_SMOKE} from '../../constants/colors';
import useNrelApiHook from '../../hooks/nrel/useNrelApi';
import useDisplayModal from '../../hooks/useDisplayModal';
import {setFilterFields} from '../../redux/slices/filter/slice';
import {height, heightRem} from '../../constants/dimensions';
import {
  showSnackDanger,
  showSnackSuccess,
  getValueStringWithSelectedItems,
} from '../../utils/functions';
import useLocationServices from '../../hooks/useLocationServices';
import useApiHook from '../../hooks/rest/useApi';
import useMapsNavigation from '../../hooks/useMapsNavigation';
import {
  networkTypeData,
  connectorTypeData,
} from '../../constants/miscellaneous';
import useSaasApiHook from '../../hooks/saas/useSaasApi';
import {DRIVER_ID} from '@env';
import {clearByBound, setByBound} from '../../redux/slices/byBound/slice';
import {
  setActiveAd,
  setActiveAdIndex,
  setAds,
} from '../../redux/slices/ads/slice';
import RightTray from './components/RightTray/index';

const Home = () => {
  const mapRef = useRef();
  const navigation = useNavigation();
  const {handleRestApi, restApiLoading} = useApiHook();
  const {handleSaasApi, saasApiLoading} = useSaasApiHook();
  const {location, requestUserCurrentLocation} = useLocationServices();
  const {filter, recentSearches, auth, ads, byBound} = useSelector(
    state => state,
  );

  const dispatch = useDispatch();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const {handleNrelApi, nrelApiLoading} = useNrelApiHook();
  const [listView, toggleListView] = useDisplayModal(false);

  const [mapLegendModal, toggleMapLegendModal] = useDisplayModal(false);
  const [filterModal, toggleFilterModal] = useDisplayModal(false);
  const [radiusModal, toggleRadiusModal] = useDisplayModal(false);
  const [searchLocationModal, toggleSearchLocationModal] =
    useDisplayModal(false);
  const [inprogressTripModal, toggleInprogressTripModal] =
    useDisplayModal(false);
  const {initializeMapLoading, intializeMapNavigation} = useMapsNavigation();

  const USER_ID = auth.user?._id;

  let ISGUEST;

  ISGUEST = isEmpty(auth.user);
  ISGUEST = isNull(auth.refreshToken);

  const [initialRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [fuelStations, setFuelStations] = useState([]);
  const [_, setHasSelectRadius, hasSelectRadiusRef] = useState(false);
  const [inprogressTrip, setInprogressTrip] = useState({});
  const [saasStation, setSaasStations] = useState([]);
  const [displayAd, setDisplayAd] = useState(true);

  const handleFuelStations = async () => {
    const {
      incAc1,
      incAc2,
      incDc,
      incLegacy,
      radius,
      owner,
      fuel,
      showPrivateStations,
      network,
      connector,
      location,
    } = filter;

    if (isEmpty(location)) {
      showSnackDanger(`Location cannot be empty`);
      return;
    }

    let chargingLevel;
    if (incAc1 && incAc2 && incDc && incLegacy) {
      chargingLevel = 'all';
    } else {
      chargingLevel = `${incAc1 ? '1,' : ''}${incAc2 ? '2,' : ''}${
        incDc ? 'dc_fast,' : ''
      }${incLegacy ? 'legacy,' : ''}`;
      chargingLevel = chargingLevel.slice(0, -1);
    }

    const data = {
      offset: '0',
      radius: radius.value,
      owner_type: owner.value,
      fuel_type: fuel.value,
      limit: 'all',
      access: showPrivateStations ? 'all' : 'public',
      ev_network: getValueStringWithSelectedItems(network),
      ev_connector_type: getValueStringWithSelectedItems(connector),
      ev_charging_level: chargingLevel,
      location: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
    };

    const response = await handleNrelApi({
      method: 'get',
      url: '/alt-fuel-stations/v1/nearest.json',
      params: data,
    });

    if (response.status === 200) {
      response?.data?.fuel_stations?.length <= 0 &&
        showSnackSuccess('No charger found nearby');
      setFuelStations(response?.data);
    }

    if (!isEmpty(byBound)) {
      getSaasChargeStation();
    }
  };
  const getSaasChargeStation = async () => {
    const {location} = filter;

    const data = {
      latitude: location.latitude,
      longitude: location.longitude,
      driverUid: DRIVER_ID,
    };

    const response = await handleSaasApi({
      method: 'post',
      url: `stations/byposition`,
      // data: byBound,
      data,
    });

    // const data = {
    //   latLngBounds: {
    //     driverUid: DRIVER_ID,
    //     southwest: {
    //       latitude: 24.61443097092009,
    //       longitude: -105.1099269730715,
    //     },
    //     northeast: {
    //       latitude: 26.91424694425041,
    //       longitude: -70.6002959250625,
    //     },
    //   },
    //   zoomLevel: 0,
    // };

    // const response = await handleSaasApi({
    //   method: "post",
    //   url: `stations/bybounds`,
    //   // data: byBound,
    //   data,
    // });

    if (response.status === 200) {
      setSaasStations(response.data.map(obj => ({...obj, type: 'saas'})));
    }
  };

  const animateToRegion = () => {
    if (!isEmpty(filter.location)) {
      mapRef.current?.animateToRegion(
        {
          latitude: filter.location.latitude,
          longitude: filter.location.longitude,
          latitudeDelta: 1.5922,
          longitudeDelta: 1.3421,
        },
        1000,
      );
    }
  };

  const handleSearchLocation = (data, details) => {
    const byBound = {
      latLngBounds: {
        driverUid: DRIVER_ID,
        southwest: {
          latitude: details?.geometry?.viewport?.southwest?.lat,
          longitude: details?.geometry?.viewport?.southwest?.lng,
        },
        northeast: {
          latitude: details?.geometry?.viewport?.northeast?.lat,
          longitude: details?.geometry?.viewport?.northeast?.lng,
        },
      },
      zoomLevel: 0,
    };

    // const byBound = {
    //   latitude: details.geometry.location.lat,
    //   longitude: details.geometry.location.lng,
    //   driverUid: DRIVER_ID,
    // }

    dispatch(setByBound(byBound));

    // const recentSearch = {
    //   description: data.description,
    //   geometry: {
    //     location: {
    //       lat: details.geometry.location.lat,
    //       lng: details.geometry.location.lng,
    //     },
    //   },
    // };

    // const uniqueRecentSearches = removeDuplicateObjArray(
    //   [...recentSearches.home, recentSearch],
    //   `description`
    // );

    // dispatch(
    //   setRecentSearchesFields({
    //     home: uniqueRecentSearches,
    //   })
    // );

    const location = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      name: data.description,
    };

    dispatch(
      setFilterFields({
        location,
      }),
    );

    toggleSearchLocationModal();
  };

  const handleApplyFilter = () => {
    dispatch(setFilterFields({applyFilter: true}));
    toggleFilterModal();
    handleFuelStations();
  };

  const handleClearFilter = () => {
    dispatch(
      setFilterFields({
        network: networkTypeData,
        showPrivateStations: false,
        showAvailableStations: true,
        connector: connectorTypeData,
        owner: {id: 1, label: 'All', value: 'all'},
        fuel: {id: 1, label: 'All', value: 'all'},
        incAc1: false,
        incAc2: true,
        incDc: true,
        applyFilter: true,
      }),
    );
    toggleFilterModal();
  };

  const handleApplyRadius = val => {
    setHasSelectRadius(true);
    dispatch(setFilterFields({radius: val, applyFilter: true}));
    toggleRadiusModal();
  };

  const getAllAds = async () => {
    const response = await handleRestApi({
      method: 'get',
      url: `ads`,
    });

    if (response.status === 200) {
      const updatedAds = response.data.ads.map(obj => ({
        ...obj,
        type: `ad`,
      }));

      dispatch(setAds(updatedAds));
    }
  };

  const handleCloseAd = () => {
    setDisplayAd(!displayAd);
  };

  useEffect(() => {
    if (!isEmpty(ads.ads)) {
      const intervalId = setInterval(() => {
        dispatch(setActiveAd(ads.ads[ads.activeAdIndex]));
        dispatch(setActiveAdIndex((ads.activeAdIndex + 1) % ads.ads.length));
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [ads.ads, ads.activeAdIndex, dispatch]);

  const getInprogressTrip = async () => {
    const response = await handleRestApi({
      method: 'get',
      url: `trip/status/${USER_ID}`,
    });

    if (response.status === 200) {
      setInprogressTrip(response.data.trip);

      if (response.data.trip) {
        toggleInprogressTripModal();
      }
    }
  };

  const completeInprogressTrip = async () => {
    const response = await handleRestApi({
      method: 'get',
      url: `trip/stop/${USER_ID}/${inprogressTrip._id}`,
    });

    if (response.status === 200) {
      toggleInprogressTripModal();
      showSnackSuccess(response.data.message);
      getAllTrips();
    }
  };

  const continueInprogressTrip = async () => {
    toggleInprogressTripModal();
    intializeMapNavigation(inprogressTrip);
  };

  useEffect(() => {
    if (!isEmpty(location)) {
      dispatch(setFilterFields({location, applyFilter: true}));
    }
  }, [location]);

  useEffect(() => {
    if (
      filter.applyFilter ||
      !isEmpty(filter.location) ||
      hasSelectRadiusRef.current
    ) {
      animateToRegion();
      handleFuelStations();
    }
  }, [filter.location, filter.radius, hasSelectRadiusRef.current, filter]);

  useEffect(() => {
    if (!listView) {
      animateToRegion();
    }
  }, [listView]);

  useEffect(() => {
    if (!ISGUEST) {
      getInprogressTrip();
    }
  }, []);

  useEffect(() => {
    const handleAppStateChange = appState => {
      if (appState === 'active') {
        requestUserCurrentLocation();
      }
    };

    if (Platform.OS === 'android') {
      const subscription = AppState.addEventListener(
        'change',
        handleAppStateChange,
      );
      return () => {
        subscription.remove();
      };
    } else {
      requestUserCurrentLocation();
    }
  }, []);

  useEffect(() => {
    getAllAds();
  }, []);

  useEffect(() => {
    if (!ISGUEST) {
      getInprogressTrip();
    }
  }, []);

  useEffect(() => {
    requestUserCurrentLocation();
  }, []);

  const goToFuelStationDetail = useCallback(
    data => {
      navigation.navigate(`FuelStationDetail`, {
        stationData: data,
      });
    },
    [navigation],
  );

  const goToSaasFuelStationDetail = useCallback(
    data => {
      navigation.navigate(`SaasFuelStationDetail`, {
        stationData: data,
      });
    },
    [navigation],
  );

  const combinedData = useMemo(
    () => [...(saasStation || []), ...(fuelStations?.fuel_stations || [])],
    [saasStation, fuelStations],
  );

  const MemoizedNRELCard = React.memo(NRELCard);
  const MemoizedSAASCard = React.memo(SAASCard);

  const memoizedFuelStations = useMemo(
    () => fuelStations.fuel_stations || [],
    [fuelStations],
  );
  const memoizedSaasStations = useMemo(() => saasStation || [], [saasStation]);

  const fuelMarkers = useMemo(() => {
    return memoizedFuelStations.map(station => {
      const commonProps = {
        key: station.id,
        coordinate: {
          latitude: parseFloat(station.latitude),
          longitude: parseFloat(station.longitude),
        },
        onPress: () => goToFuelStationDetail(station),
      };

      if (station?.access_code === 'private') {
        return <CustomMarker {...commonProps} type="private" />;
      }

      if (filter.incAc1 && station.ev_level1_evse_num) {
        return <CustomMarker {...commonProps} type="level1" />;
      }

      if (filter.incDc && station?.ev_dc_fast_num) {
        return <CustomMarker {...commonProps} type="dcfast" />;
      }

      if (filter.incAc2 && station?.ev_level2_evse_num) {
        return <CustomMarker {...commonProps} type="level2" />;
      }

      return null;
    });
  }, [memoizedFuelStations]);

  const saasMarkers = useMemo(
    () =>
      memoizedSaasStations.map(item => (
        <CustomMarker
          key={item?.stationId}
          coordinate={{
            latitude: parseFloat(item?.gpsLat),
            longitude: parseFloat(item?.gpsLong),
          }}
          type={`saas`}
          onPress={() => goToSaasFuelStationDetail(item)}
        />
      )),
    [memoizedSaasStations],
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: WHITE,
        paddingTop: insets.top,
      }}>
      {nrelApiLoading ||
      restApiLoading ||
      initializeMapLoading ||
      saasApiLoading ? (
        <Loader />
      ) : null}

      <DecisionModal
        isVisible={inprogressTripModal}
        label={`Trip to ${inprogressTrip?.destination?.text}`}
        message={`Your trip to ${inprogressTrip?.destination?.text} is in progress. Do you want it to continue or mark as completed?`}
        leftButtonText={`Mark as Completed`}
        rightButtonText={`Continue`}
        leftButtonPress={completeInprogressTrip}
        rightButtonPress={continueInprogressTrip}
        onCloseModalPress={toggleInprogressTripModal}
        displayCloseButton={true}
      />

      <MapLegendModal
        isVisible={mapLegendModal}
        onCloseModal={toggleMapLegendModal}
        label={`Map Legend`}
      />

      <FilterModal
        isVisible={filterModal}
        label={`Filter`}
        closeModal={toggleFilterModal}
        onApplyFilter={handleApplyFilter}
        onClearFilter={handleClearFilter}
      />

      <RadiusModal
        isVisible={radiusModal}
        onCloseModal={toggleRadiusModal}
        label={`Radius`}
        getSelectedItem={handleApplyRadius}
      />

      <GooglePlacesAutocompleteModal
        isVisible={searchLocationModal}
        label={`Search Location`}
        closeModal={toggleSearchLocationModal}
        onSelectLocation={handleSearchLocation}
        displayCurrentLocation={false}
        recentSearches={recentSearches.home}
        autoFocus={true}
      />

      <HomeHeader
        onFilterPress={() => {
          dispatch(setFilterFields({applyFilter: false}));
          toggleFilterModal();
        }}
        onTextInputPress={toggleSearchLocationModal}
        label={filter.location.name || `Search Location`}
        onClearTextInput={() => {
          dispatch(setFilterFields({location: {}}));
          dispatch(clearByBound());
        }}
      />

      {displayAd && !isEmpty(ads.ads) && !isEmpty(ads.activeAd) && !listView ? (
        <AdBannerSecondary onAdClose={handleCloseAd} />
      ) : null}

      {listView ? (
        <View style={styles.listViewContainer}>
          <FlatList
            data={combinedData}
            // data={[...saasStation, ...fuelStations.fuel_stations]}
            keyExtractor={item => item.id || item.stationId}
            renderItem={({item}) => (
              <Fragment>
                {isUndefined(item.type) && <MemoizedNRELCard data={item} />}
                {item.type === 'saas' && <MemoizedSAASCard data={item} />}
              </Fragment>
            )}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => (
              <View
                style={{
                  height:
                    Platform.OS === 'ios' ? tabBarHeight : tabBarHeight * 2,
                }}
              />
            )}
            style={{
              marginBottom: heightRem,
            }}
            ListEmptyComponent={() => (
              <View
                style={{
                  height,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: insets.top,
                  paddingBottom: tabBarHeight + insets.bottom,
                }}>
                <Text style={{color: BLACK}}>No fuel station found</Text>
              </View>
            )}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
          }}>
          <MapView
            ref={mapRef}
            initialRegion={initialRegion}
            provider={PROVIDER_DEFAULT}
            rotateEnabled={false}
            style={{flex: 1}}>
            {!isEmpty(filter.location) && (
              <CustomMarker
                coordinate={{
                  latitude: filter.location.latitude,
                  longitude: filter.location.longitude,
                }}
                zIndex={1}
                type="pin"
              />
            )}
            <Fragment>
              {fuelMarkers}
              {saasMarkers}
            </Fragment>
          </MapView>
        </View>
      )}

      <View
        style={{
          bottom:
            Platform.OS === 'ios' ? tabBarHeight * 1.1 : tabBarHeight * 1.6,
        }}>
        <RightTray
          listView={listView}
          onListViewPress={toggleListView}
          onMapLegendPress={toggleMapLegendModal}
          onRadiusSelectionPress={() => {
            dispatch(setFilterFields({applyFilter: false}));
            toggleRadiusModal();
          }}
          onCurrentLocationPress={() => {
            dispatch(setFilterFields({applyFilter: false}));
            requestUserCurrentLocation();
          }}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  listViewContainer: {
    flex: 1,
    backgroundColor: WHITE_SMOKE,
    marginTop: heightRem * 10,
  },
});
