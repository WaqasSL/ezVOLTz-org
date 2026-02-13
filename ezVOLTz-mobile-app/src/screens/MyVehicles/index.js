import React, { useCallback, useEffect, useRef } from "react";
import { SafeAreaView, View, StyleSheet, Platform } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { SwipeListView } from "react-native-swipe-list-view";
import { isEmpty } from "lodash";
import useState from "react-usestateref";

import PrimaryHeader from "../../components/Headers/PrimaryHeader";
import VerticalSpace from "../../components/VerticalSpace";
import Loader from "../../components/Loader";
import VehicleListCard from "../../components/Cards/VehicleListCard";
import SwipeItem from "./components/SwipeItem";
import SolidButton from "../../components/Buttons/SolidButton";
import EmptyList from "../../components/EmptyList";
import AdBannerPrimary from "../../components/Ads/AdBannerPrimary";
import DecisionModal from "../../components/Modals/DecisionModal";

import { BLACK, JASPER_CANE, WHITE, WHITE_SMOKE } from "../../constants/colors";
import useApiHook from "../../hooks/rest/useApi";
import { widthRem } from "../../constants/dimensions";
import { setVehiclesAd } from "../../redux/slices/ads/slice";
import useDisplayModal from "../../hooks/useDisplayModal";

const MyVehicles = () => {
  const { handleRestApi, restApiLoading } = useApiHook();
  const { auth, ads } = useSelector((state) => state);
  const swipeListViewRef = useRef(null);
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [deleteVehicleModal, toggleDeleteVehicleModal] = useDisplayModal(false);

  const USER_ID = auth?.user?._id;

  const [vehicles, setVehicles] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [_, setVehicleToDelete, vehicleToDeleteRef] = useState(``);
  const [adHeight, setAdHeight] = useState(0);

  const getAllVehicles = async () => {
    const response = await handleRestApi({
      method: `get`,
      url: `vehicle/${USER_ID}`,
    });

    if (response.status === 200) {
      var newArray = [...response.data];
      if (!isEmpty(ads.activeAd) && ads.vehiclesAd && newArray.length >= 1) {
        newArray.splice(1, 0, { type: `ad`, _id: `ad1` });
      }

      setVehicles(newArray);
    }

    setIsDataLoaded(true);
  };

  const deleteVehicle = async () => {
    const response = await handleRestApi({
      method: `delete`,
      url: `vehicle/${USER_ID}/${vehicleToDeleteRef.current}`,
    });

    if (response.status === 200) {
      toggleDeleteVehicleModal();

      getAllVehicles();
    }
  };

  const handleAdClose = () => {
    setVehicles(vehicles.filter((item) => item.type !== `ad`));

    dispatch(setVehiclesAd(false));
  };

  useEffect(() => {
    if (isFocused) {
      // if (swipeListViewRef.current) {
      //   swipeListViewRef.current.scrollToIndex({ index: 0 });
      // }

      getAllVehicles();
    }
  }, [isFocused]);

  const goToAddVehicle = useCallback(() => {
    navigation.navigate(`AddVehicle`);
  }, [navigation]);

  const goToEditVehicle = useCallback(
    (item) => {
      navigation.navigate(`EditVehicle`, { vehicle: item });
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      {restApiLoading && <Loader />}

      <DecisionModal
        isVisible={deleteVehicleModal}
        label={`Delete Vehicle Confirmation`}
        message={`Are you sure you want to delete your vehicle?\nAll trips associated with this vehicle will be permanently deleted.`}
        leftButtonText={`No, I don't want to`}
        rightButtonText={`Yes`}
        leftButtonPress={toggleDeleteVehicleModal}
        rightButtonPress={deleteVehicle}
      />

      <PrimaryHeader label={`My Vehicles`} color={BLACK} />

      <VerticalSpace h={1} />

      <View style={styles.listContainer}>
        {!isDataLoaded || isEmpty(vehicles) ? (
          <>
            {!isDataLoaded ? null : (
              <EmptyList
                label={`No Vehicle Found`}
                buttonLable={`Add New Vehicle`}
                onPress={goToAddVehicle}
              />
            )}
          </>
        ) : (
          <SwipeListView
            listViewRef={swipeListViewRef}
            data={vehicles}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <>
                {ads.vehiclesAd &&
                item.type === `ad` &&
                !isEmpty(ads.activeAd) ? (
                  <View
                    style={{ alignSelf: "center" }}
                    onLayout={(event) => {
                      const { height } = event.nativeEvent.layout;
                      setAdHeight(height);
                    }}
                  >
                    <AdBannerPrimary onAdClose={handleAdClose} />
                  </View>
                ) : (
                  <VehicleListCard data={item} />
                )}
              </>
            )}
            // renderItem={({ item }) => <VehicleListCard data={item} />}
            renderHiddenItem={({ item }) => (
              <>
                {item.type === `ad` ? null : (
                  <SwipeItem
                    onDeletePress={() => {
                      toggleDeleteVehicleModal();
                      setVehicleToDelete(item?._id);
                    }}
                    onEditPress={() => goToEditVehicle(item)}
                  />
                )}
              </>
            )}
            // renderHiddenItem={({ item }) => <SwipeItem
            //   onDeletePress={() => {
            //     toggleDeleteVehicleModal()
            //     setVehicleToDelete(item?._id)
            //   }}
            //   onEditPress={() => goToEditVehicle(item?._id)}
            // />}
            rightOpenValue={-widthRem * 34}
            disableRightSwipe={true}
            keyExtractor={(item) => item?._id}
            ListFooterComponent={
              <>
                <VerticalSpace h={1} />

                <SolidButton
                  label={`Add New Vehicle`}
                  size={`lg`}
                  customButtonStyle={styles.customAddVehicleButton}
                  customTextStyle={styles.customAddVehicleText}
                  onPress={goToAddVehicle}
                />

                {/* <View style={{ height: tabBarHeight + adHeight }} /> */}
                <View
                  style={{
                    height:
                      Platform.OS === "android"
                        ? tabBarHeight * 2.2
                        : tabBarHeight * 1.4,
                  }}
                />
              </>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default MyVehicles;

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  listContainer: {
    flex: 1,
    backgroundColor: WHITE_SMOKE,
  },
  customAddVehicleButton: {
    backgroundColor: JASPER_CANE,
    alignSelf: "center",
  },
  customAddVehicleText: { color: BLACK },
});
