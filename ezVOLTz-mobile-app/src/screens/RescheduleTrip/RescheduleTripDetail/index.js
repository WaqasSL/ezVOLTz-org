import { ArrowDown2, Car, Clock, Location, Trash } from "iconsax-react-native";
import React, { useCallback, useEffect } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isEmpty, isNull } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import useState from "react-usestateref";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import NetworkLogger from "react-native-network-logger";

import HorizontalSpace from "../../../components/HorizontalSpace";
import PrimaryHeader from "../../../components/Headers/PrimaryHeader";
import VerticalSpace from "../../../components/VerticalSpace";
import PickerPanel from "../../../components/PickerPanel";
import AddStopButton from "../../../components/Buttons/AddStopButton";
import VehicleCard from "../../../components/Cards/VehicleCard";
import Circle from "../../../components/Circle";
import CustomSelect from "../../../components/CustomSelect";
import SolidButton from "../../../components/Buttons/SolidButton";
import GooglePlacesAutocompleteModal from "../../../components/Modals/GooglePlacesAutocompleteModal";
import SingleSelectDropdown from "../../../components/Dropdown/SingleSelectDropdown";
import ChangeVehicleModal from "../../../components/Modals/ChangeVehicleModal";
import Loader from "../../../components/Loader";
import Dropzone from "../../../components/Dropzone";

import {
  BERN_RED,
  BLACK,
  FLINT_STONE,
  LIGHT_GREY,
  PINBALL,
  THEME,
  WHITE,
  WHITE_SMOKE,
} from "../../../constants/colors";
import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";
import { BERTIOGASANS_REGULAR } from "../../../constants/fonts";
import {
  CLOSE_GREY,
  CONNECTOR_TYPE,
  NETWORK_TYPE,
  AVOID_TOLLS_ACTIVE,
  AVOID_TOLLS_INACTIVE,
  AVOID_HIGHWAY_INACTIVE,
  AVOID_HIGHWAY_ACTIVE,
  AVAILABLE_CHARGERS_ACTIVE,
  AVAILABLE_CHARGERS_INACTIVE,
} from "../../../assets/icons";
import {
  networkTypeData,
  connectorTypeData,
} from "../../../constants/miscellaneous";
import useDisplayModal from "../../../hooks/useDisplayModal";
import {
  formatDate,
  formatTime,
  getDirectionsAndEstimates,
  validateTrip,
  getStopsCoordinates,
  showSnackDanger,
} from "../../../utils/functions";
import useApiHook from "../../../hooks/rest/useApi";
import { setTripFields } from "../../../redux/slices/trip/slice";

const RescheduleTripDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { handleRestApi, restApiLoading } = useApiHook();
  const { auth, trip, recentSearches } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [networkTypeModal, toggleNetworkTypeModal] = useDisplayModal(false);
  const [connectorTypeModal, toggleConnectorTypeModal] = useDisplayModal(false);
  const [dateModal, toggleDateModal] = useDisplayModal(false);
  const [timeModal, toggleTimeModal] = useDisplayModal(false);
  const [changeVehicleModal, toggleChangeVehicleModal] = useDisplayModal(false);

  const USER_ID = auth?.user?._id;
  const TRIP_ID = route.params?.tripId;

  const [apiLoading, setApiLoading] = useState(false);
  const [
    googlePlacesAutocompleteLocationModal,
    setGooglePlacesAutocompleteLocationModal,
  ] = useState({
    isVisible: false,
    locationType: null,
  });
  const [
    googlePlacesAutocompleteStopModal,
    setGooglePlacesAutocompleteStopModal,
  ] = useState({
    isVisible: false,
    stopIndex: null,
  });
  const [_, setVehicles, vehiclesRef] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const toggleGooglePlacesAutocompleteLocationModal = (locationType) => {
    setGooglePlacesAutocompleteLocationModal((prev) => ({
      ...prev,
      isVisible: !prev.isVisible,
      locationType: locationType,
    }));
  };

  const toggleGooglePlacesAutocompleteStopModal = (index) => {
    setGooglePlacesAutocompleteStopModal((prev) => ({
      ...prev,
      isVisible: !prev.isVisible,
      stopIndex: index,
    }));
  };

  const handleSelectLocation = (data, details) => {
    const location = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      name: data.description,
    };

    dispatch(
      setTripFields({
        [googlePlacesAutocompleteLocationModal.locationType]: location,
      }),
    );

    toggleGooglePlacesAutocompleteLocationModal(null);
  };

  const handleSelectCurrentLocation = (data) => {
    dispatch(
      setTripFields({
        [googlePlacesAutocompleteLocationModal.locationType]: data,
      }),
    );

    toggleGooglePlacesAutocompleteLocationModal(null);
  };

  const handleSelectStop = (data, details) => {
    const location = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      name: data.description,
      type: "stop",
    };

    let updatedStops = [...trip.stops];
    updatedStops[googlePlacesAutocompleteStopModal.stopIndex] = location;

    dispatch(
      setTripFields({
        stops: updatedStops,
      }),
    );

    toggleGooglePlacesAutocompleteStopModal(null);
  };

  const handleAddStop = () => {
    const stop = {
      latitude: 0,
      longitude: 0,
      name: "",
      type: "",
    };

    dispatch(
      setTripFields({
        stops: [...trip.stops, stop],
      }),
    );
  };

  const handleRemoveStop = (index) => {
    dispatch(
      setTripFields({
        stops: trip.stops.filter((_, i) => i !== index),
      }),
    );
  };

  const clearItemVal = (type, emptyItemVal) => {
    dispatch(
      setTripFields({
        [type]: emptyItemVal,
      }),
    );
  };

  const clearStop = (index) => {
    const location = {
      latitude: 0,
      longitude: 0,
      name: "",
      type: "",
    };

    let updatedStops = [...trip.stops];
    updatedStops[index] = location;
    dispatch(
      setTripFields({
        stops: updatedStops,
      }),
    );
  };

  const swapOriginAndDestination = () => {
    dispatch(
      setTripFields({
        origin: trip.destination,
        destination: trip.origin,
      }),
    );
  };

  const toggleCustomSelect = (key) => {
    dispatch(
      setTripFields({
        [key]: !trip[key],
      }),
    );
  };

  const previewOnMap = async () => {
    if (!validateTrip(trip)) {
      return;
    }

    try {
      const response = await getDirectionsAndEstimates(trip, setApiLoading);

      if (isNull(response)) {
        return;
      }

      dispatch(
        setTripFields({
          directions: response,
          stops: trip.stops.filter((obj) => {
            return (
              obj.latitude !== 0 ||
              obj.longitude !== 0 ||
              obj.name !== "" ||
              obj.type !== ""
            );
          }),
        }),
      );
      goToRescheduleTripPreview();
    } catch (error) {
      console.error(error);
    }
  };

  const getAllVehicles = async () => {
    const response = await handleRestApi({
      method: `get`,
      url: `vehicle/${USER_ID}`,
    });

    if (response?.status === 200) {
      setVehicles(response?.data);
      dispatch(
        setTripFields({
          vehicle: response?.data[0],
        }),
      );
    }

    setIsDataLoaded(true);
  };

  const getTripDetail = async () => {
    const response = await handleRestApi({
      method: "get",
      url: `trip/${USER_ID}/${TRIP_ID}`,
    });

    if (response?.status === 200) {
      const data = response.data.trip;

      const origin = {
        name: data.origin.text,
        latitude: data.origin.latitude,
        longitude: data.origin.longitude,
      };
      const destination = {
        name: data.destination.text,
        latitude: data.destination.latitude,
        longitude: data.destination.longitude,
      };
      const date = data.startDate;
      const time = data.startTime;
      const avoidTolls = data.avoidTolls;
      const avoidHighways = data.avoidHighways;
      const availableChargers =
        data.chargersType === "availableChargers" ? true : false;
      const network = networkTypeData.find(
        (item) => item.value === data.network,
      );
      const connector = connectorTypeData.find(
        (item) => item.value === data.connector,
      );
      const vehicle = data.vehicleId;

      dispatch(
        setTripFields({
          origin,
          destination,
          date,
          time,
          avoidTolls,
          avoidHighways,
          availableChargers,
          network,
          connector,
          vehicle,
        }),
      );

      getStopsCoordinates(data).then((coordinaes) => {
        dispatch(
          setTripFields({
            stops: coordinaes,
          }),
        );
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAllVehicles();
    }, []),
  );

  useEffect(() => {
    getTripDetail();
  }, []);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const goToAddVehicle = useCallback(() => {
    navigation.navigate(`AddVehicle`);
  }, [navigation]);

  const goToEditVehicle = useCallback(() => {
    navigation.navigate(`EditVehicle`, {
      vehicle: trip.vehicle,
    });
  }, [navigation, trip.vehicle]);

  const goToRescheduleTripPreview = useCallback(() => {
    navigation.navigate(`RescheduleTripPreview`, { tripId: TRIP_ID });
  }, [navigation]);

  return (
    <>
      <StatusBar backgroundColor={THEME} barStyle="dark-content" />
      <View style={styles.container(insets)}>
        {restApiLoading || apiLoading ? <Loader /> : null}

        {/* origin & destination */}
        <GooglePlacesAutocompleteModal
          isVisible={googlePlacesAutocompleteLocationModal.isVisible}
          label={
            googlePlacesAutocompleteLocationModal.locationType === "origin"
              ? `Starting Location*`
              : `Destination*`
          }
          closeModal={() => toggleGooglePlacesAutocompleteLocationModal(null)}
          onSelectLocation={handleSelectLocation}
          displayCurrentLocation={
            googlePlacesAutocompleteLocationModal.locationType === "origin"
              ? true
              : false
          }
          recentSearches={
            recentSearches[googlePlacesAutocompleteLocationModal.locationType]
          }
          onSelectUserLocation={handleSelectCurrentLocation}
          autoFocus={true}
        />

        {/* stops */}
        <GooglePlacesAutocompleteModal
          isVisible={googlePlacesAutocompleteStopModal.isVisible}
          label={`Choose stop ${
            googlePlacesAutocompleteStopModal.stopIndex + 1
          }`}
          closeModal={() => toggleGooglePlacesAutocompleteStopModal(null)}
          onSelectLocation={handleSelectStop}
          displayCurrentLocation={false}
          recentSearches={recentSearches.stops}
          autoFocus={true}
        />

        {/* date picker */}
        {dateModal && (
          <DateTimePickerModal
            minimumDate={new Date()}
            isVisible={dateModal}
            mode="date"
            onConfirm={(date) => {
              toggleDateModal();

              dispatch(setTripFields({ date, time: new Date(date) }));
            }}
            onCancel={toggleDateModal}
            date={isNull(trip.date) ? new Date() : new Date(trip.date)}
          />
        )}

        {/* time picker */}
        {timeModal && (
          <DateTimePickerModal
            minimumDate={new Date()}
            isVisible={timeModal}
            mode="time"
            date={!isNull(trip.date) ? new Date(trip.date) : new Date()}
            onConfirm={(time) => {
              toggleTimeModal();

              let date = new Date(time).getDate() + 1;
              dispatch(
                setTripFields({
                  time,
                }),
              );
              if (isNull(trip.date)) {
                dispatch(
                  setTripFields({
                    date: new Date(time.setDate(date)),
                  }),
                );
              }
            }}
            onCancel={toggleTimeModal}
          />
        )}

        {/* change vehicle modal */}
        {!isEmpty(vehiclesRef.current) && !isEmpty(trip.vehicle) && (
          <ChangeVehicleModal
            isVisible={changeVehicleModal}
            onCloseModal={toggleChangeVehicleModal}
            label={`Change Vehicle`}
            data={vehiclesRef.current}
            value={trip.vehicle}
            getSelectedItem={(val) =>
              dispatch(
                setTripFields({
                  vehicle: val,
                }),
              )
            }
          />
        )}

        {/* header */}
        <PrimaryHeader
          label={`Reschedule Trip`}
          color={WHITE}
          displayBackButton={true}
          onBackButtonPress={goBack}
          labelStyles={{
            fontWeight: "700",
            fontSize: screenRem * 1.4,
          }}
        />

        <Text style={styles.selectRouteFiltersText}>
          Select your route and filters
        </Text>

        <VerticalSpace h={3} />

        <View style={styles.edgeView(insets)}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <PickerPanel
              label={
                !isEmpty(trip.origin) ? trip.origin?.name : "Starting Location*"
              }
              leftIcon={<Circle />}
              onPickerPanelPress={() =>
                toggleGooglePlacesAutocompleteLocationModal("origin")
              }
              rightIcon={
                !isEmpty(trip.origin) && (
                  <Pressable onPress={() => clearItemVal(`origin`, {})}>
                    <CLOSE_GREY height={screenRem} width={screenRem} />
                  </Pressable>
                )
              }
            />

            <VerticalSpace h={2} />

            {trip.stops.map((item, index) => (
              <View key={index}>
                <PickerPanel
                  label={
                    item?.name === "" ? `Choose Stop ${index + 1}` : item?.name
                  }
                  leftIcon={<Circle />}
                  onPickerPanelPress={() =>
                    toggleGooglePlacesAutocompleteStopModal(index)
                  }
                  rightIcon={
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Pressable onPress={() => handleRemoveStop(index)}>
                        <Trash color="red" size={screenRem * 1.2} />
                      </Pressable>
                      {item?.name === "" && (
                        <>
                          <HorizontalSpace w={2} />
                          <Pressable onPress={() => clearStop(index)}>
                            <CLOSE_GREY height={screenRem} width={screenRem} />
                          </Pressable>
                        </>
                      )}
                    </View>
                  }
                />

                <VerticalSpace h={2} />
              </View>
            ))}

            <AddStopButton
              onAddStopPress={handleAddStop}
              onSwapPress={swapOriginAndDestination}
            />

            <VerticalSpace h={2} />

            <PickerPanel
              label={
                !isEmpty(trip.destination)
                  ? trip.destination?.name
                  : "Destination*"
              }
              leftIcon={<Location size={screenRem} color={BERN_RED} />}
              onPickerPanelPress={() =>
                toggleGooglePlacesAutocompleteLocationModal("destination")
              }
              rightIcon={
                !isEmpty(trip.destination) && (
                  <Pressable onPress={() => clearItemVal(`destination`, {})}>
                    <CLOSE_GREY height={screenRem} width={screenRem} />
                  </Pressable>
                )
              }
            />

            <VerticalSpace h={2} />

            <PickerPanel
              label={
                isNull(trip.date) ? "Choose Start Date" : formatDate(trip.date)
              }
              leftIcon={<Clock size={screenRem} color={BLACK} />}
              onPickerPanelPress={toggleDateModal}
              rightIcon={
                !isNull(trip.date) && (
                  <Pressable onPress={() => clearItemVal(`date`, null)}>
                    <CLOSE_GREY height={screenRem} width={screenRem} />
                  </Pressable>
                )
              }
            />

            <VerticalSpace h={2} />

            <PickerPanel
              label={
                isNull(trip.time) ? "Choose Start Time" : formatTime(trip.time)
              }
              leftIcon={<Clock size={screenRem} color={BLACK} />}
              onPickerPanelPress={toggleTimeModal}
              rightIcon={
                !isNull(trip.time) && (
                  <Pressable onPress={() => clearItemVal(`time`, null)}>
                    <CLOSE_GREY height={screenRem} width={screenRem} />
                  </Pressable>
                )
              }
            />

            <VerticalSpace h={2} />

            <Text style={styles.heading}>
              Vehicle<Text style={{ color: "red" }}>*</Text>
            </Text>

            <VerticalSpace h={2} />

            {!isDataLoaded || isEmpty(vehiclesRef.current) ? (
              <>
                {!isDataLoaded ? (
                  <View style={styles.vehicleLoader} />
                ) : (
                  <Dropzone onPress={goToAddVehicle} label={`Add Vehicle`} />
                )}
              </>
            ) : (
              <VehicleCard
                displayActionButton={true}
                onAddVehiclePress={goToAddVehicle}
                onEditVehiclePress={goToEditVehicle}
                onChangeVehiclePress={toggleChangeVehicleModal}
                data={trip.vehicle}
              />
            )}

            <VerticalSpace h={2} />

            <Text style={styles.heading}>Filters</Text>

            <VerticalSpace h={2} />

            <SingleSelectDropdown
              label={`Select Network Type*`}
              data={networkTypeData}
              isVisible={networkTypeModal}
              getSelectedItem={(item) =>
                dispatch(setTripFields({ network: item }))
              }
              value={trip.network}
              leftIcon={<NETWORK_TYPE />}
              rightIcon={<ArrowDown2 size={screenRem} color={PINBALL} />}
              toggleSingleSelectDropdown={toggleNetworkTypeModal}
            />

            <VerticalSpace h={2} />

            <SingleSelectDropdown
              label={`Select Connector Type*`}
              data={connectorTypeData}
              isVisible={connectorTypeModal}
              getSelectedItem={(item) =>
                dispatch(setTripFields({ connector: item }))
              }
              value={trip.connector}
              leftIcon={<CONNECTOR_TYPE />}
              rightIcon={<ArrowDown2 size={screenRem} color={PINBALL} />}
              toggleSingleSelectDropdown={toggleConnectorTypeModal}
            />

            <VerticalSpace h={2} />

            <ScrollView
              contentContainerStyle={{
                flexDirection: "row",
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <CustomSelect
                label={`Vehicle Compatible`}
                value={trip.vehicleCompatibility}
                onCustomSelectPress={() =>
                  toggleCustomSelect("vehicleCompatibility")
                }
              >
                <Car
                  size={screenRem * 1.4}
                  color={trip.vehicleCompatibility ? THEME : LIGHT_GREY}
                />
              </CustomSelect>

              <CustomSelect
                label={`Avoid Tolls`}
                value={trip.avoidTolls}
                onCustomSelectPress={() => toggleCustomSelect("avoidTolls")}
              >
                {trip.avoidTolls ? (
                  <AVOID_TOLLS_ACTIVE />
                ) : (
                  <AVOID_TOLLS_INACTIVE />
                )}
              </CustomSelect>

              <CustomSelect
                label={`Avoid Highways`}
                value={trip.avoidHighways}
                onCustomSelectPress={() => toggleCustomSelect("avoidHighways")}
              >
                {trip.avoidHighways ? (
                  <AVOID_HIGHWAY_ACTIVE />
                ) : (
                  <AVOID_HIGHWAY_INACTIVE />
                )}
              </CustomSelect>

              <CustomSelect
                label={`Available Chargers`}
                value={trip.availableChargers}
                onCustomSelectPress={() =>
                  toggleCustomSelect("availableChargers")
                }
              >
                {trip.availableChargers ? (
                  <AVAILABLE_CHARGERS_ACTIVE />
                ) : (
                  <AVAILABLE_CHARGERS_INACTIVE />
                )}
              </CustomSelect>
            </ScrollView>

            <VerticalSpace h={2} />

            <SolidButton label={`Preview On Map`} onPress={previewOnMap} />

            <VerticalSpace h={2} />

            {/* <NetworkLogger /> */}
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default RescheduleTripDetail;

const styles = StyleSheet.create({
  container: (insets) => ({
    flex: 1,
    backgroundColor: THEME,
    paddingTop: insets.top,
  }),
  heading: {
    color: THEME,
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem,
  },
  selectRouteFiltersText: {
    fontFamily: BERTIOGASANS_REGULAR,
    color: WHITE,
    fontSize: screenRem * 1.2,
    paddingHorizontal: widthRem * 4,
    marginLeft: widthRem * 2,
  },
  edgeView: (insets) => ({
    flex: 1,
    backgroundColor: WHITE,
    borderTopLeftRadius: screenRem * 6,
    paddingBottom: insets.bottom,
    paddingHorizontal: widthRem * 4,
    paddingTop: screenRem * 3,
  }),
  vehicleLoader: {
    height: heightRem * 16,
    width: widthRem * 92,
    borderRadius: screenRem,
    backgroundColor: WHITE_SMOKE,
    alignItems: "center",
    justifyContent: "center",
  },
});
