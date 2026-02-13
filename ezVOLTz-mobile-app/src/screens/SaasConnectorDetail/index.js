import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useCallback } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { SkypeIndicator } from "react-native-indicators";
import useState from "react-usestateref";
import NetworkLogger from "react-native-network-logger";

import PrimaryHeader from "../../components/Headers/PrimaryHeader";
import Dropzone from "../../components/Dropzone";
import VehicleCard from "../../components/Cards/VehicleCard";
import ChangeVehicleModal from "../../components/Modals/ChangeVehicleModal";
import VerticalSpace from "../../components/VerticalSpace";
import OutlineTextInput from "../../components/TextInputs/OutlineTextInput";
import SolidButton from "../../components/Buttons/SolidButton";
import Loader from "../../components/Loader";

import { BLACK, THEME, WHITE, WHITE_SMOKE } from "../../constants/colors";
import useApiHook from "../../hooks/rest/useApi";
import { heightRem, screenRem, widthRem } from "../../constants/dimensions";
import useDisplayModal from "../../hooks/useDisplayModal";
import { SOAP_URL } from "@env";
import { showSnackSuccess } from "../../utils/functions";
import { DRIVER_ID } from "@env";
import {
  clearSaasChargeDetails,
  setPreparingId,
  setSaasChargeDetails,
} from "../../redux/slices/saasCharge/slice";

const SaasConnectorDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { handleRestApi, restApiLoading } = useApiHook();
  const [changeVehicleModal, toggleChangeVehicleModal] = useDisplayModal(false);

  const USER_ID = auth?.user?._id;
  const PAYMENT = route.params.payment;
  const CONNECTOR = route.params.connector;

  const [_, setVehicles, vehiclesRef] = useState([]);
  const [__, setVehicle, vehicleRef] = useState({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [loadingStart, setLoadingStart] = useState(false);

  const getAllVehicles = async () => {
    const response = await handleRestApi({
      method: `get`,
      url: `vehicle/${USER_ID}`,
    });

    if (response.status === 200) {
      setVehicle(response?.data[0]);
      setVehicles(response.data);
    }

    setIsDataLoaded(true);
  };

  const handleStartCharging = async () => {
    setLoadingStart(true);
    const data = {
      idTag: PAYMENT.idTag,
      // idTag: DRIVER_ID,
      chargeBoxId: CONNECTOR.stationBoxId,
      connectorId: CONNECTOR.connectors[0].id,
      connectorName: CONNECTOR.connectors[0].name,
      soapUrl: SOAP_URL,
      vehicleId: vehicleRef.current._id,
      userId: USER_ID,
      connectorPk: CONNECTOR.connectorPk,
    };

    const response = await handleRestApi({
      method: `post`,
      url: `charger/start-charging`,
      data,
    });
    console.log("response-----------", response?.data);
    if (response.status === 200) {
      if (response?.data?.data?.isPolling) {
        dispatch(setPreparingId(response?.data?.charger?._id));
        dispatch(setSaasChargeDetails(CONNECTOR?.connectorPk));
        showSnackSuccess(response?.data?.message);
      } else {
        showSnackSuccess("Charging started successfully");
      }
      goBack();
    }

    setLoadingStart(false);
  };

  useFocusEffect(
    useCallback(() => {
      getAllVehicles();
      // dispatch(clearSaasChargeDetails())
    }, []),
  );

  const goToHome = useCallback(() => {
    navigation.navigate(`Home`);
  }, [navigation]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const goToAddVehicle = useCallback(() => {
    navigation.navigate(`AddVehicle`);
  }, [navigation]);

  const goToEditVehicle = useCallback(() => {
    navigation.navigate(`EditVehicle`, {
      vehicle: vehicleRef.current,
    });
  }, [navigation, vehicleRef.current]);

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      {loadingStart && restApiLoading ? <Loader /> : null}
      {/* change vehicle modal */}
      {!isEmpty(vehiclesRef.current) && !isEmpty(vehicleRef.current) && (
        <ChangeVehicleModal
          isVisible={changeVehicleModal}
          onCloseModal={toggleChangeVehicleModal}
          label={`Change Vehicle`}
          data={vehiclesRef.current}
          value={vehicleRef.current}
          getSelectedItem={(val) => setVehicle(val)}
        />
      )}

      <PrimaryHeader
        label={`ezVOLTz`}
        color={BLACK}
        displayBackButton={true}
        onBackButtonPress={goBack}
      />

      <View style={styles.childContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {!isDataLoaded || isEmpty(vehiclesRef.current) ? (
            <>
              {!isDataLoaded ? (
                <View style={styles.vehicleLoader}>
                  <SkypeIndicator color={THEME} />
                </View>
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
              data={vehicleRef.current}
            />
          )}

          <VerticalSpace h={2} />

          <OutlineTextInput
            placeholder={`Station Box Id`}
            editable={false}
            value={CONNECTOR.stationBoxId}
          />

          <VerticalSpace h={2} />

          <OutlineTextInput
            placeholder={`Connector Id`}
            editable={false}
            value={CONNECTOR.connectors[0].id.toString()}
          />

          <VerticalSpace h={2} />

          {CONNECTOR.connectors[0].status === `Available` && (
            <SolidButton
              label={`Start Charging`}
              size={`xl`}
              onPress={handleStartCharging}
            />
          )}

          {/* <NetworkLogger /> */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SaasConnectorDetail;

const styles = StyleSheet.create({
  safeAreaViewContainer: { flex: 1, backgroundColor: WHITE },
  childContainer: { flex: 1, paddingHorizontal: widthRem * 4 },
  vehicleLoader: {
    height: heightRem * 16,
    width: widthRem * 92,
    borderRadius: screenRem,
    backgroundColor: WHITE_SMOKE,
    alignItems: "center",
    justifyContent: "center",
  },
});
