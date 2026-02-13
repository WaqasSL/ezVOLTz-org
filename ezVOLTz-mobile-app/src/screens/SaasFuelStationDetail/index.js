import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Arrow } from "iconsax-react-native";
import { isEmpty, isNull } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useStripe } from "@stripe/stripe-react-native";
import useState from "react-usestateref";
import NetworkLogger from "react-native-network-logger";

import PrimaryHeader from "../../components/Headers/PrimaryHeader";
import Line from "../../components/Line";
import VerticalSpace from "../../components/VerticalSpace";
import Loader from "../../components/Loader";
import ConnectorDetailModal from "../../components/Modals/ConnectorDetailModal";

import {
  BLACK,
  FLINT_STONE,
  JASPER_CANE,
  THEME,
  WHITE,
  WHITE_SMOKE,
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
import useLocationServices from "../../hooks/useLocationServices";
import useApiHook from "../../hooks/rest/useApi";
import useSaasApiHook from "../../hooks/saas/useSaasApi";
import useStripeInitialize from "../../hooks/useStripInitialize";
import { DRIVER_ID, SOAP_URL } from "@env";
import { restInstance } from "../../utils/instance";
import { showSnackDanger, showSnackSuccess } from "../../utils/functions";
import useDisplayModal from "../../hooks/useDisplayModal";
import { chargerStatus, saasConnectorStatuBadge } from "../../constants/enum";
import DecisionModal from "../../components/Modals/DecisionModal";
import {
  clearSaasChargeDetails,
  setSaasChargeDetails,
} from "../../redux/slices/saasCharge/slice";
import { CustomConnector } from "../../components/CustomConnector";
import FastImage from "react-native-fast-image";

const SaasFuelStationDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { location, requestUserCurrentLocation } = useLocationServices();
  const { handleRestApi, restApiLoading } = useApiHook();
  const { handleSaasApi, saasApiLoading } = useSaasApiHook();
  const [guestModal, toggleGuestModal] = useDisplayModal(false);
  const dispatch = useDispatch();
  const { auth, saasCharge, notifications } = useSelector((state) => state);
  const { presentPaymentSheet } = useStripe();
  const { stripeInitializeLoading, initializePaymentSheet, paymentIntent } =
    useStripeInitialize();
  const [connectorDetailModal, toggleConnectorDetailModal] = useDisplayModal();

  const STATION = route.params.stationData;
  const USER_ID = auth.user._id;

  let ISGUEST;
  ISGUEST = isEmpty(auth.user);
  ISGUEST = isEmpty(auth.refreshToken);

  const [retailPriceData, setRetailPriceData] = useState({});
  const [_, setUserPaymentAccount, userPaymentAccountRef] = useState({});
  const [__, setConnectorToStart, connectorToStartRef] = useState({});
  const [___, setConnectorDetail, connectorDetailRef] = useState({});
  const [____, setConnectorPk, connectorPkRef] = useState(``);
  const [_____, setChargingActivity, chargingActivityRef] = useState({});

  const getStationRetailPrice = async () => {
    const response = await handleSaasApi({
      method: "post",
      url: `retail-price`,
      data: {
        idTag: DRIVER_ID,
        stationBoxId: STATION.stationBoxId,
      },
    });

    if (response.status == 200) {
      setRetailPriceData(response.data.data);
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

  const getUserPaymentAccount = async () => {
    const response = await handleRestApi({
      method: "get",
      url: `account/${USER_ID}`,
    });
    if (response.status === 200) {
      setUserPaymentAccount(response.data.account);
      if (
        isNull(response?.data?.account?.driverId) ||
        isNull(response?.data?.account?.idTag)
      ) {
        onCreateDriver();
      } else {
        getUserPaymentMethods();
      }
    }
  };

  const onCreateDriver = async () => {
    const response = await handleRestApi({
      method: "get",
      url: `saascharge/driver/${USER_ID}`,
    });

    if (response?.status === 200) {
      onStartCharging();
    }
  };

  const getUserPaymentMethods = async () => {
    const response = await handleRestApi({
      method: "get",
      url: `account/payment-methods/${USER_ID}`,
    });

    if (response?.status === 200) {
      if (isEmpty(response.data.paymentMethods.data)) {
        openPaymentSheet();
      } else {
        getConnectorPk();
        // goToSaasConnectorDetail();
      }
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      showSnackDanger(`${error.message}.`);
    } else {
      savePayment();
    }
  };

  const savePayment = async () => {
    const data = {
      setupIntentId: paymentIntent?.setupIntentId,
      clientSecret: paymentIntent?.setupIntent,
      customerId: paymentIntent?.customer,
      userId: USER_ID,
    };

    try {
      const response = await restInstance.post(`account/payment/`, data, {
        headers: {
          Authorization: "Bearer " + auth.accessToken,
        },
      });

      if (response.status === 200) {
        showSnackSuccess("Your payment method has been saved.");

        getConnectorPk();
        // goToSaasConnectorDetail();
      }
    } catch (err) {
      onStartCharging();
    }
  };

  const onStartCharging = () => {
    getUserPaymentAccount();
  };

  const handleStartCharging = (id) => {
    toggleConnectorDetailModal();

    setConnectorToStart({
      ...retailPriceData,
      connectors: retailPriceData.connectors.filter(
        (connector) => connector.id === id,
      ),
    });

    onStartCharging();
  };

  const handleDisplayConnectorDetail = (id) => {
    setConnectorDetail(
      retailPriceData.connectors.find((connector) => connector.id === id),
    );
    if (ISGUEST) {
      toggleGuestModal();
    } else {
      toggleConnectorDetailModal();
    }
  };

  const getConnectorPk = async () => {
    const response = await handleSaasApi({
      method: "get",
      url: `connectors/${STATION.stationId}/status`,
    });

    if (response.status === 200) {
      setConnectorPk(
        response.data.find(
          (item) =>
            item.connectorId === connectorToStartRef.current.connectors[0].id,
        ).connectorPk,
      );

      goToSaasConnectorDetail();
    }
  };

  const handleStopCharging = async () => {
    toggleConnectorDetailModal();

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
      getStationRetailPrice();

      // goBack();
    }
  };
  const handleCancelPreparing = async () => {
    toggleConnectorDetailModal();
    const data = {
      chargerId: chargingActivityRef.current?._id,
      userId: USER_ID,
    };
    const response = await handleRestApi({
      method: `post`,
      url: `charger/cancel-charging`,
      data,
    });
    if (response.status === 200) {
      dispatch(setSaasChargeDetails(null));
      showSnackSuccess(response?.data?.message);
      setChargingActivity({});
      getStationRetailPrice();
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!ISGUEST) {
        getChargingActivity();
        initializePaymentSheet();
        getStationRetailPrice();
      }
    }, [notifications?.notification]),
  );

  useEffect(() => {
    if (!isEmpty(location)) {
      goToGetDirection(location);
    }
  }, [location]);

  const goToGetDirection = useCallback(
    (location) => {
      navigation.navigate(`GetDirection`, {
        locationUser: location,
        locationFuelStation: {
          latitude: STATION.gpsLat,
          longitude: STATION.gpsLong,
        },
      });
    },
    [navigation],
  );

  const goToSaasConnectorDetail = useCallback(() => {
    navigation.navigate(`SaasConnectorDetail`, {
      payment: userPaymentAccountRef.current,
      connector: {
        ...connectorToStartRef.current,
        connectorPk: connectorPkRef.current,
      },
    });
  }, [navigation]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const goToAccessAccount = useCallback(() => {
    navigation.navigate("AccessAccount");
  }, [navigation]);

  const CustomIconButton = ({
    iconComponent,
    iconColor,
    backgroundColor,
    label,
    onPress,
  }) => (
    <Pressable style={styles.customButtonContainer} onPress={onPress}>
      <View style={styles.customButtonIconContainer(backgroundColor)}>
        {React.cloneElement(iconComponent, {
          size: screenRem * 1.6,
          color: iconColor,
        })}
      </View>

      <VerticalSpace h={1} />

      <Text style={styles.customButtonLabelText}>{label}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      {restApiLoading || saasApiLoading || stripeInitializeLoading ? (
        <Loader />
      ) : null}

      {!isEmpty(connectorDetailRef.current) && (
        <ConnectorDetailModal
          isVisible={connectorDetailModal}
          label={`Connector Detail`}
          data={connectorDetailRef.current}
          onCloseModal={toggleConnectorDetailModal}
          onStartCharging={() =>
            handleStartCharging(connectorDetailRef.current.id)
          }
          chargingActivity={chargingActivityRef?.current}
          onStopCharging={handleStopCharging}
          onCancelPreparing={handleCancelPreparing}
        />
      )}

      <DecisionModal
        isVisible={guestModal}
        label={`Create an Account or Login`}
        message={`Welcome to ezVOLTz. Would you like to create an account or log in to access additional features and personalize your experience?`}
        leftButtonText={`No`}
        rightButtonText={`Yes`}
        leftButtonPress={toggleGuestModal}
        rightButtonPress={() => {
          toggleGuestModal();
          goToAccessAccount();
        }}
        displayCloseButton={false}
      />

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

          <View style={styles.detailContainer}>
            <View style={styles.nameAddressContainer}>
              <Text style={styles.stationName}>{STATION.stationName}</Text>

              <VerticalSpace h={1} />

              <Text style={styles.stationAddress}>
                {STATION.stationStreet}, {STATION.stationCity},{" "}
                {STATION.stationState}
              </Text>
            </View>

            <Line />

            <View style={styles.buttonsContainer}>
              <CustomIconButton
                iconComponent={<Arrow />}
                iconColor={WHITE}
                backgroundColor={THEME}
                label={`Get${`\n`}Direction`}
                onPress={requestUserCurrentLocation}
              />
            </View>

            <Line />

            <VerticalSpace h={2} />

            {/* connectors */}
            {!isEmpty(retailPriceData) && (
              <View>
                {!isEmpty(retailPriceData.connectors) &&
                  retailPriceData.connectors?.map((item, index) => (
                    <CustomConnector
                      key={index}
                      item={item}
                      onPress={() => handleDisplayConnectorDetail(item.id)}
                      getStationRetailPrice={getStationRetailPrice}
                      STATION={STATION}
                      USER_ID={USER_ID}
                      restApiLoading={restApiLoading}
                      saasApiLoading={saasApiLoading}
                      stripeInitializeLoading={stripeInitializeLoading}
                      chargingActivityRef={chargingActivityRef}
                    />
                  ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SaasFuelStationDetail;

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
  buttonsContainer: {
    paddingVertical: heightRem * 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  customButtonContainer: { alignItems: "center", justifyContent: "center" },
  customButtonIconContainer: (backgroundColor) => ({
    height: screenRem * 4,
    width: screenRem * 4,
    backgroundColor,
    borderRadius: screenRem * 2,
    borderWidth: 1,
    borderColor: backgroundColor === THEME ? THEME : JASPER_CANE,
    alignItems: "center",
    justifyContent: "center",
  }),
  customButtonLabelText: {
    textAlign: "center",
    fontSize: screenRem,
    color: FLINT_STONE,
    fontFamily: BERTIOGASANS_REGULAR,
  },
  connectorTouchableContainer: {
    width: widthRem * 92,
    backgroundColor: WHITE_SMOKE,
    paddingVertical: heightRem * 2.4,
    borderRadius: screenRem,
    paddingHorizontal: widthRem * 4,
    marginBottom: heightRem * 2,
  },
  connectorDetailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  connectorDetailItemLabel: {
    fontFamily: BERTIOGASANS_REGULAR,
    color: FLINT_STONE,
    fontSize: screenRem,
  },
  connectorDetailItemValue: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.2,
  },
  detailWidthContainer: { width: `33%` },
  startChargingCustomButton: {
    paddingVertical: heightRem * 1.4,
    alignSelf: "center",
  },
  startChargingCustomText: { fontSize: screenRem },
  connectorStatusContainer: {
    backgroundColor: "red",
    paddingHorizontal: widthRem * 4,
    paddingVertical: heightRem * 0.6,
    borderRadius: width,
  },
  connectorStatusText: {
    fontFamily: BERTIOGASANS_REGULAR,
    alignSelf: "center",
    color: WHITE,
    fontSize: screenRem,
  },
  scanToChargeContainer: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
  },
});
