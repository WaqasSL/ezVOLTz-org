import React, { useRef, useCallback, useEffect } from "react";
import { SafeAreaView, View, StyleSheet, Text, Platform } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import useState from "react-usestateref";
import { isEmpty } from "lodash";

import PrimaryHeader from "../../components/Headers/PrimaryHeader";
import SwitchButton from "./components/SwitchButton";
import VerticalSpace from "../../components/VerticalSpace";
import PastTripCard from "../../components/Cards/PastTripCard";
import SwipeItem from "./components/SwipeItem";
import Loader from "../../components/Loader";
import UpcomingTripCard from "../../components/Cards/UpcomingTripCard";
import EmptyList from "../../components/EmptyList";
import DecisionModal from "../../components/Modals/DecisionModal";
import AdBannerPrimary from "../../components/Ads/AdBannerPrimary";

import { BLACK, WHITE, WHITE_SMOKE } from "../../constants/colors";
import { widthRem } from "../../constants/dimensions";
import useApiHook from "../../hooks/rest/useApi";
import {
  filterUpcomingTrips,
  filterPastTrips,
  showSnackSuccess,
} from "../../utils/functions";
import { clearTrip } from "../../redux/slices/trip/slice";
import useMapsNavigation from "../../hooks/useMapsNavigation";
import useDisplayModal from "../../hooks/useDisplayModal";
import { setPastTripAd, setUpcomingTripAd } from "../../redux/slices/ads/slice";
import EmptyListTrips from "../../components/EmptyListTrips";

const MyTrips = () => {
  const { handleRestApi, restApiLoading } = useApiHook();
  const { auth, ads } = useSelector((state) => state);
  const dispatch = useDispatch();
  const swipeListViewRef = useRef(null);
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const { initializeMapLoading, intializeMapNavigation } = useMapsNavigation();
  const [inprogressTripModal, toggleInprogressTripModal] =
    useDisplayModal(false);
  const [startTripModal, toggleStartTripModal] = useDisplayModal(false);
  const [deleteTripModal, toggleDeleteTripModal] = useDisplayModal(false);
  const [__, setTripToDelete, tripToDeleteRef] = useState(``);

  const isFocused = useIsFocused();

  const USER_ID = auth?.user?._id;

  const [activeSwitch, setActiveSwitch] = useState("Upcoming Trips");
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const [tripList, setTripList] = useState([]);
  const [inprogressTrip, setInprogressTrip] = useState({});
  const [_, setTripToStartById, tripToStartByIdRef] = useState(``);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [adHeight, setAdHeight] = useState(0);

  const handleSwitchChange = (switchType) => {
    const list = switchType === "upcoming" ? upcomingTrips : pastTrips;

    if (list?.length > 0 && swipeListViewRef.current) {
      // if (Platform.OS === 'android') {
      //   swipeListViewRef.current?.scrollToIndex({ index: 0 });
      // }
    }

    setActiveSwitch(switchType);
  };

  const getAllTrips = async () => {
    const response = await handleRestApi({
      method: "get",
      url: `trip/${USER_ID}`,
    });

    if (response?.status === 200) {
      var allTrips = response?.data?.trips;
      var upcomingTrips = filterUpcomingTrips(allTrips);
      var pastTrips = filterPastTrips(allTrips);

      setUpcomingTrips(upcomingTrips);
      setPastTrips(pastTrips);
      setTripList(allTrips);

      if (allTrips.length > 0 && !isEmpty(ads.activeAd)) {
        var adObject = { type: "ad", _id: "ad1" };
        if (upcomingTrips.length >= 1 && ads.upcomingTripAd) {
          upcomingTrips.splice(1, 0, adObject);
          setUpcomingTrips(upcomingTrips);
        }
        if (pastTrips.length >= 1 && ads.pastTripAd) {
          pastTrips.splice(1, 0, adObject);
          setPastTrips(pastTrips);
        }
      }
    }

    setIsDataLoaded(true);
  };

  const handleAdClose = () => {
    if (activeSwitch === `Upcoming Trips`) {
      setUpcomingTrips(upcomingTrips.filter((item) => item.type !== `ad`));

      dispatch(setUpcomingTripAd(false));
    } else {
      setPastTrips(pastTrips.filter((item) => item.type !== `ad`));

      dispatch(setPastTripAd(false));
    }
  };

  const deleteTrip = async () => {
    toggleDeleteTripModal();
    const response = await handleRestApi({
      method: "delete",
      url: `trip/${USER_ID}/${tripToDeleteRef.current}`,
    });

    if (response?.status === 200) {
      showSnackSuccess(response?.data?.message);
      getAllTrips();
    }
  };

  const adjustPress = (tripId) => {
    dispatch(clearTrip());
    if (activeSwitch === "Upcoming Trips") {
      goToUpdateTrip(tripId);
    } else {
      goToRescheduleTrip(tripId);
    }
  };

  const getInprogressTrip = async () => {
    const response = await handleRestApi({
      method: "get",
      url: `trip/status/${USER_ID}`,
    });

    if (response.status === 200) {
      setInprogressTrip(response.data.trip);

      if (response.data.trip) {
        toggleInprogressTripModal();
      }
    }
  };

  const startTripById = async () => {
    toggleStartTripModal();

    const data = {
      startTime: new Date(),
      startDate: new Date(),
    };

    const response = await handleRestApi({
      method: "post",
      url: `trip/start/${USER_ID}/${tripToStartByIdRef.current}`,
      data,
    });

    if (response.status === 200) {
      getAssociatedVehicle(response.data.trip);
    }
  };

  const getAssociatedVehicle = async (tripData) => {
    const response = await handleRestApi({
      method: "get",
      url: `vehicle/${USER_ID}/${tripData?.vehicleId}`,
    });

    if (response.status === 200) {
      const data = {
        ...tripData,
        ...response.data,
      };

      intializeMapNavigation(data);
    }
  };

  const completeInprogressTrip = async () => {
    const response = await handleRestApi({
      method: "get",
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
    if (isFocused) {
      getAllTrips();
    }
  }, [isFocused]);

  useEffect(() => {
    getInprogressTrip();
  }, []);

  const goToTripDetail = useCallback(
    (id, type) => {
      navigation.navigate(`TripDetail`, {
        tripId: id,
        tripType: type,
      });
    },
    [navigation],
  );

  const goToUpdateTrip = useCallback(
    (tripId) => {
      navigation.navigate("UpdateTrip", {
        screen: "UpdateTripDetail",
        params: { tripId },
      });
    },
    [navigation],
  );

  const goToRescheduleTrip = useCallback(
    (tripId) => {
      navigation.navigate("RescheduleTrip", {
        screen: "RescheduleTripDetail",
        params: { tripId },
      });
    },
    [navigation],
  );

  const goToPlanTrip = useCallback(() => {
    navigation.navigate("PlanTrip");
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      {restApiLoading || initializeMapLoading ? <Loader /> : null}
      <DecisionModal
        isVisible={startTripModal}
        label={`Start Trip`}
        message={`Would you like to start your trip?`}
        leftButtonText={`No`}
        rightButtonText={`Yes`}
        leftButtonPress={toggleStartTripModal}
        rightButtonPress={startTripById}
      />
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
      <DecisionModal
        isVisible={deleteTripModal}
        label={`Delete Trip Confirmation`}
        message={`Are you sure you want to delete this trip?`}
        leftButtonText={`No, I don't want to`}
        rightButtonText={`Yes`}
        leftButtonPress={toggleDeleteTripModal}
        rightButtonPress={deleteTrip}
      />
      <PrimaryHeader label={`My Trips`} color={BLACK} />

      <SwitchButton
        activeSwitch={activeSwitch}
        onPressButton={handleSwitchChange}
      />
      <View style={styles.listContainer}>
        {/* {!isDataLoaded || isEmpty(tripList) ? (
          <>
            {!isDataLoaded ? null : (
              <EmptyList
                label={`No Trip Found`}
                buttonLable={`Plan a Trip`}
                onPress={goToPlanTrip}
              />
            )}
          </>
        ) : ( */}
        <SwipeListView
          listViewRef={swipeListViewRef}
          data={activeSwitch === "Upcoming Trips" ? upcomingTrips : pastTrips}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            return !isDataLoaded ? null : (
              <EmptyListTrips
                label={"No trips planned yet?"}
                desc={`Start exploring charging stations and plan your next journey with ease. Tap 'Plan a Trip' to get started.`}
                buttonLable={`Plan a Trip`}
                onPress={goToPlanTrip}
              />
            );
          }}
          renderItem={({ item }) => {
            if (item?.type === "ad") {
              return (
                <View
                  style={{ alignSelf: "center" }}
                  onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    setAdHeight(height);
                  }}
                >
                  <AdBannerPrimary onAdClose={handleAdClose} />
                </View>
              );
            }

            return activeSwitch === "Upcoming Trips" ? (
              <UpcomingTripCard
                data={item}
                onCardPress={() => goToTripDetail(item?._id, "upcoming")}
                onStartTripPress={() => {
                  setTripToStartById(item?._id);
                  toggleStartTripModal();
                }}
              />
            ) : (
              <PastTripCard
                data={item}
                onCardPress={() => goToTripDetail(item?._id, "past")}
              />
            );
          }}
          renderHiddenItem={({ item }) =>
            item?.status === "inprogress" || item.type === `ad` ? null : (
              <SwipeItem
                activeSwitch={activeSwitch}
                onDeletePress={() => {
                  toggleDeleteTripModal();
                  setTripToDelete(item?._id);
                }}
                onAdjustPress={() => adjustPress(item?._id)}
              />
            )
          }
          rightOpenValue={-widthRem * 34}
          disableRightSwipe={true}
          keyExtractor={(item) => item?._id}
          // ListFooterComponent={<View style={{ height: tabBarHeight + adHeight }} />}
          ListFooterComponent={
            <View
              style={{
                height: Platform.OS === "ios" ? tabBarHeight : tabBarHeight * 2,
              }}
            />
          }
        />
        {/* )} */}
      </View>
    </SafeAreaView>
  );
};

export default MyTrips;

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  listContainer: {
    flex: 1,
    backgroundColor: WHITE_SMOKE,
  },
});
