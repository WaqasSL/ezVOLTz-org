import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useCallback } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { isEmpty } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import useState from "react-usestateref";

import PrimaryHeader from "../../components/Headers/PrimaryHeader";
import Line from "../../components/Line";
import VerticalSpace from "../../components/VerticalSpace";
import Loader from "../../components/Loader";
import SolidButton from "../../components/Buttons/SolidButton";

import {
  BERN_RED,
  BLACK,
  FLINT_STONE,
  JASPER_CANE,
  WHITE,
} from "../../constants/colors";
import {
  heightRem,
  screenRem,
  width,
  widthRem,
} from "../../constants/dimensions";
import images from "../../constants/images";
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../constants/fonts";
import useApiHook from "../../hooks/rest/useApi";
import useSaasApiHook from "../../hooks/saas/useSaasApi";
import { DRIVER_ID, SOAP_URL } from "@env";
import { showSnackSuccess } from "../../utils/functions";
import { clearSaasChargeDetails } from "../../redux/slices/saasCharge/slice";
import FastImage from "react-native-fast-image";

const SaasFuelStationStopCharging = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { handleRestApi, restApiLoading } = useApiHook();
  const { handleSaasApi, saasApiLoading } = useSaasApiHook();
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const STATION = route.params.stationData;
  const USER_ID = auth.user._id;

  const [retailPriceData, setRetailPriceData] = useState({});
  const [connectorDetail, setConnectorDetail] = useState({});
  const [_, setChargingActivity, chargingActivityRef] = useState({});

  const getStationRetailPrice = async () => {
    const response = await handleSaasApi({
      method: "post",
      url: `retail-price`,
      data: {
        idTag: DRIVER_ID,
        stationBoxId: STATION.chargeBoxId,
      },
    });

    if (response.status == 200) {
      setRetailPriceData(response.data.data);
      setConnectorDetail(
        response.data.data.connectors.find(
          (connector) => connector.status === `Charging`,
        ),
      );
    }
  };

  const getChargingActivity = async () => {
    const response = await handleRestApi({
      method: "get",
      url: `charger/in-charging/${USER_ID}`,
    });

    if (response.status === 200) {
      setChargingActivity(response.data.charging);
    }
  };

  const handleStopCharging = async () => {
    const data = {
      idTag: chargingActivityRef.current.idTag,
      chargeBoxId: chargingActivityRef.current.chargeBoxId,
      chargerId: chargingActivityRef.current._id,
      transactionId: chargingActivityRef.current.transactionPk,
      userId: USER_ID,
      soapUrl: SOAP_URL,
    };

    const response = await handleRestApi({
      method: `post`,
      url: `charger/stop-charging`,
      data,
    });

    if (response.status === 200) {
      dispatch(clearSaasChargeDetails());
      showSnackSuccess("Charging stopped successfully");
      goToHome();
    }
  };

  useFocusEffect(
    useCallback(() => {
      getChargingActivity();
      getStationRetailPrice();
    }, []),
  );

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const goToHome = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      {restApiLoading || saasApiLoading ? <Loader /> : null}

      <PrimaryHeader
        label={`ezVOLTz`}
        color={BLACK}
        displayBackButton={true}
        onBackButtonPress={goBack}
      />

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <FastImage
            source={images.fuelStation}
            style={styles.fuelStationImage}
            resizeMode={"stretch"}
          />

          {!isEmpty(retailPriceData) && !isEmpty(connectorDetail) && (
            <View style={styles.detailContainer}>
              <View style={styles.nameAddressContainer}>
                <Text style={styles.stationName}>
                  {retailPriceData.stationName}
                </Text>

                <VerticalSpace h={1} />

                <Text style={styles.stationAddress}>
                  {retailPriceData.stationAddress.street},{" "}
                  {retailPriceData.stationAddress.city},{" "}
                  {retailPriceData.stationAddress.zip}
                </Text>
              </View>

              <Line />

              <VerticalSpace h={2} />

              <View>
                <View style={styles.connectorDetailRow}>
                  <View style={styles.halfContainer}>
                    <Text style={styles.connectorDetailLabel}>Power</Text>

                    <VerticalSpace h={1.6} />

                    <Text style={styles.connectorDetailValue}>
                      {connectorDetail.power}
                    </Text>
                  </View>

                  <View style={styles.halfContainer}>
                    <Text style={styles.connectorDetailLabel}>
                      Connector ID
                    </Text>

                    <VerticalSpace h={1.6} />

                    <Text style={styles.connectorDetailValue}>
                      #{connectorDetail.id}
                    </Text>
                  </View>
                </View>

                <VerticalSpace h={2} />

                <View style={styles.connectorDetailRow}>
                  <View style={styles.halfContainer}>
                    <Text style={styles.connectorDetailLabel}>Plug Type</Text>

                    <VerticalSpace h={1.6} />

                    <Text style={styles.connectorDetailValue}>
                      {connectorDetail.plugType}
                    </Text>
                  </View>

                  <View style={styles.halfContainer}>
                    <Text style={styles.connectorDetailLabel}>Status</Text>

                    <VerticalSpace h={1.6} />

                    <Text
                      style={{
                        ...styles.connectorDetailValue,
                        color: BERN_RED,
                      }}
                    >
                      {connectorDetail.status}
                    </Text>
                  </View>
                </View>

                <VerticalSpace h={2} />

                <View style={styles.connectorDetailRow}>
                  <View style={styles.halfContainer}>
                    <Text style={styles.connectorDetailLabel}>Price kWh</Text>

                    <VerticalSpace h={1.6} />

                    <Text style={styles.connectorDetailValue}>
                      {connectorDetail.priceKwh}
                    </Text>
                  </View>

                  <View style={styles.halfContainer}>
                    <Text style={styles.connectorDetailLabel}>
                      Price Per Minute
                    </Text>

                    <VerticalSpace h={1.6} />

                    <Text style={styles.connectorDetailValue}>
                      {connectorDetail.priceMinute}
                    </Text>
                  </View>
                </View>
              </View>

              <VerticalSpace h={4} />

              {USER_ID === chargingActivityRef.current.userId && (
                <SolidButton
                  label={`Stop Charging`}
                  customButtonStyle={{ backgroundColor: JASPER_CANE }}
                  customTextStyle={{ color: BLACK }}
                  onPress={handleStopCharging}
                />
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SaasFuelStationStopCharging;

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  container: { flex: 1 },
  fuelStationImage: {
    height: heightRem * 28,
    width,
  },
  detailContainer: {
    paddingHorizontal: widthRem * 4,
  },
  nameAddressContainer: { paddingVertical: heightRem * 2 },
  stationName: {
    fontSize: screenRem * 1.4,
    fontFamily: BERTIOGASANS_MEDIUM,
  },
  stationAddress: {
    fontSize: screenRem * 1.2,
    fontFamily: BERTIOGASANS_REGULAR,
    color: FLINT_STONE,
  },
  connectorDetailRow: { flexDirection: "row", alignItems: "center" },
  halfContainer: { width: `50%` },
  connectorDetailLabel: {
    fontFamily: BERTIOGASANS_REGULAR,
    color: FLINT_STONE,
    fontSize: screenRem * 1.1,
  },
  connectorDetailValue: {
    fontFamily: BERTIOGASANS_MEDIUM,
    color: BLACK,
    fontSize: screenRem * 1.3,
  },
});
