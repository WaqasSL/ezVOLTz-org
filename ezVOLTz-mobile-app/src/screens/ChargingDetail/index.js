import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import moment from "moment";
import { isEmpty } from "lodash";

import VerticalSpace from "../../components/VerticalSpace";
import PrimaryHeader from "../../components/Headers/PrimaryHeader";
import ChargingStatus from "../../components/ChargingStatus";
import Line from "../../components/Line";
import VehicleCard from "../../components/Cards/VehicleCard";
import Loader from "../../components/Loader";
import SolidButton from "../../components/Buttons/SolidButton";
import ReceiptModal from "../../components/Modals/ReceiptModal";

import {
  BLACK,
  FLINT_STONE,
  JASPER_CANE,
  THEME,
  WHITE,
} from "../../constants/colors";
import {
  height,
  heightRem,
  screenRem,
  widthRem,
} from "../../constants/dimensions";
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../constants/fonts";
import useSaasApiHook from "../../hooks/saas/useSaasApi";
import { formatChargeTime } from "../../utils/functions";
import useDisplayModal from "../../hooks/useDisplayModal";
import { useSelector } from "react-redux";
import useApiHook from "../../hooks/rest/useApi";

const ChargingDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { auth } = useSelector((state) => state);

  const USER_ID = auth?.user?._id;
  const { handleSaasApi, saasApiLoading } = useSaasApiHook();
  const { handleRestApi, restApiLoading } = useApiHook();
  const [receiptModal, toggleReceiptModal] = useDisplayModal(false);

  const { chargingActivity } = route.params;
  const [transactionData, setTransactionData] = useState({});
  const [vehicle, setVehicle] = useState([]);

  const getTransactionDetail = async () => {
    const response = await handleSaasApi({
      method: "get",
      url: `price/${chargingActivity.transactionPk}`,
    });

    setTransactionData(response.data);
  };

  const getVehicles = async () => {
    const response = await handleRestApi({
      method: `get`,
      url: `vehicle/${USER_ID}/${chargingActivity?.vehicleId?._id}`,
    });

    if (response.status === 200) {
      setVehicle(response?.data);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getTransactionDetail();
      getVehicles();
    }, []),
  );

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      {saasApiLoading && restApiLoading && <Loader />}

      {!isEmpty(transactionData) && (
        <ReceiptModal
          isVisible={receiptModal}
          data={transactionData}
          closeModal={toggleReceiptModal}
        />
      )}

      <PrimaryHeader
        label={`Charging Details`}
        color={BLACK}
        displayBackButton={true}
        onBackButtonPress={goBack}
      />

      <View style={styles.childContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.spaceBtnContainer}>
            <View>
              <VerticalSpace h={2} />

              <View>
                <Text style={styles.stationName}>
                  {chargingActivity.chargeBoxId}
                </Text>

                <VerticalSpace h={1.4} />

                <Text style={styles.connectorName}>
                  {chargingActivity.connectorName}
                </Text>

                <VerticalSpace h={1.4} />

                <ChargingStatus status={chargingActivity.status} />
              </View>

              <VerticalSpace h={2} />
              <Line />
              <VerticalSpace h={2} />

              {!isEmpty(transactionData) && (
                <>
                  <View>
                    <View style={styles.transactionDetailRow}>
                      <View style={styles.halfContainer}>
                        <Text style={styles.transactionDetailLabel}>
                          Total Cost
                        </Text>

                        <VerticalSpace h={1.6} />

                        <Text style={styles.transactionDetailValue}>
                          ${transactionData.totalCost?.toFixed(2)}
                        </Text>
                      </View>

                      <View style={styles.halfContainer}>
                        <Text style={styles.transactionDetailLabel}>
                          Currency
                        </Text>

                        <VerticalSpace h={1.6} />

                        <Text style={styles.transactionDetailValue}>
                          {transactionData.currency}
                        </Text>
                      </View>
                    </View>

                    <VerticalSpace h={4} />

                    <View style={styles.transactionDetailRow}>
                      <View style={styles.halfContainer}>
                        <Text style={styles.transactionDetailLabel}>
                          kW Quantity
                        </Text>

                        <VerticalSpace h={1.6} />

                        <Text style={styles.transactionDetailValue}>
                          {transactionData.kwquantity?.toFixed(2)}
                        </Text>
                      </View>

                      <View style={styles.halfContainer}>
                        <Text style={styles.transactionDetailLabel}>
                          Calculated kW Cost
                        </Text>

                        <VerticalSpace h={1.6} />

                        <Text style={styles.transactionDetailValue}>
                          {transactionData.calculatedKwCost?.toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    <VerticalSpace h={4} />

                    <View style={styles.transactionDetailRow}>
                      <View style={styles.halfContainer}>
                        <Text style={styles.transactionDetailLabel}>
                          Start Time
                        </Text>

                        <VerticalSpace h={1.6} />

                        <Text style={styles.transactionDetailValue}>
                          {formatChargeTime(
                            transactionData.transaction.transactionStart,
                          )}
                        </Text>
                      </View>

                      <View style={styles.halfContainer}>
                        <Text style={styles.transactionDetailLabel}>
                          Stop Time
                        </Text>

                        <VerticalSpace h={1.6} />

                        <Text style={styles.transactionDetailValue}>
                          {formatChargeTime(
                            transactionData.transaction.transactionStop,
                          )}
                        </Text>
                      </View>
                    </View>

                    <VerticalSpace h={2} />
                  </View>
                  <Line />
                  <VerticalSpace h={2} />
                </>
              )}

              <VehicleCard data={vehicle} />
              <VerticalSpace h={2} />
            </View>
            <View>
              {!isEmpty(transactionData) && (
                <SolidButton
                  label={`View Receipt`}
                  customButtonStyle={{ backgroundColor: THEME }}
                  customTextStyle={{ color: WHITE }}
                  onPress={toggleReceiptModal}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ChargingDetail;

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  childContainer: {
    flex: 1,
    paddingHorizontal: widthRem * 4,
    paddingVertical: heightRem * 2,
  },
  stationName: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.3,
    color: BLACK,
  },
  connectorName: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.2,
    color: FLINT_STONE,
  },
  transactionDetailRow: { flexDirection: "row", alignItems: "center" },
  halfContainer: { width: `50%` },
  transactionDetailLabel: {
    fontFamily: BERTIOGASANS_REGULAR,
    color: FLINT_STONE,
    fontSize: screenRem * 1.1,
  },
  transactionDetailValue: {
    fontFamily: BERTIOGASANS_MEDIUM,
    color: BLACK,
    fontSize: screenRem * 1.3,
  },
  spaceBtnContainer: {
    height: Platform.OS === "android" ? heightRem * 86 : heightRem * 76,
    justifyContent: "space-between",
  },
});
