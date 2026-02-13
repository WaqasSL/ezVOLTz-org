import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";

import PrimaryHeader from "../../components/Headers/PrimaryHeader";
import ChargingActivityCard from "../../components/Cards/ChargingActivityCard";
import EmptyList from "../../components/EmptyList";
import VerticalSpace from "../../components/VerticalSpace";
import Loader from "../../components/Loader";

import { BLACK, WHITE, WHITE_SMOKE } from "../../constants/colors";
import useApiHook from "../../hooks/rest/useApi";
import { heightRem } from "../../constants/dimensions";
import { showSnackSuccess } from "../../utils/functions";
import { setSaasChargeDetails } from "../../redux/slices/saasCharge/slice";

const ChargingActivities = () => {
  const navigation = useNavigation();
  const { handleRestApi, restApiLoading } = useApiHook();
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch()
  const USER_ID = auth?.user?._id;

  const [chargingActivities, setChargingActivities] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const getAllChargingActivities = async () => {
    const response = await handleRestApi({
      method: `get`,
      url: `charger/${USER_ID}`,
    });
    if (response.status === 200) {
      setChargingActivities(response.data.charging.reverse());
    }

    setIsDataLoaded(true);
  };

  const cancelPreparing = async (item) => {
    setIsDataLoaded(true);

    const data = {
      chargerId: item?._id,
      userId: USER_ID
    }
    const response = await handleRestApi({
      method: `post`,
      url: `charger/cancel-charging`,
      data
    });


    if (response.status === 200) {
      dispatch(setSaasChargeDetails(null))
      showSnackSuccess(response?.data?.message)
      getAllChargingActivities()
    }

  };

  useFocusEffect(
    useCallback(() => {
      getAllChargingActivities();
    }, [])
  );

  const goToChargingDetail = useCallback(
    (data) => {
      navigation.navigate(`ChargingDetail`, {
        chargingActivity: data,
      });
    },
    [navigation]
  );

  const goToSaasFuelStationStopCharging = useCallback(
    (data) => {
      navigation.navigate(`SaasFuelStationStopCharging`, {
        stationData: data,
      });
    },
    [navigation]
  );

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      {restApiLoading && <Loader />}

      <PrimaryHeader
        label={`Charging History`}
        color={BLACK}
        displayBackButton={true}
        onBackButtonPress={goBack}
      />

      <View style={styles.childContainer}>
        {!isDataLoaded || isEmpty(chargingActivities) ? (
          <>
            {!isDataLoaded ? null : (
              <EmptyList
                label={`No Charging Activity Found`}
                displayButton={false}
              />
            )}
          </>
        ) : (
          <FlatList
            data={chargingActivities}
            renderItem={({ item }) => (
              <ChargingActivityCard
                data={item}
                onPressCancel={() => cancelPreparing(item)}
                onPress={() => {
                  if (item?.status === 'cancelled') {
                    console.log('cancelled');
                  } else {
                    if (item.status === `charged` && item.status !== `preparing`) {
                      goToChargingDetail(item);
                    } else if (item.status !== `preparing`) {
                      goToSaasFuelStationStopCharging(item);
                    }
                  }
                }}
              />
            )}
            keyExtractor={(item, index) => index}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerStyle}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChargingActivities;

const styles = StyleSheet.create({
  safeAreaViewContainer: { flex: 1, backgroundColor: WHITE },
  childContainer: { flex: 1, backgroundColor: WHITE_SMOKE },
  contentContainerStyle: { paddingTop: heightRem * 2 },
});
