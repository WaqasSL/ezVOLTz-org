import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { useSelector } from "react-redux";
import useState from "react-usestateref";
import { ArrowLeft } from "iconsax-react-native";
import { isEmpty } from "lodash";

import VerticalSpace from "../../components/VerticalSpace";
import PrimaryHeader from "../../components/Headers/PrimaryHeader";
import SolidButton from "../../components/Buttons/SolidButton";
import OutlineTextInput from "../../components/TextInputs/OutlineTextInput";
import Loader from "../../components/Loader";
import OutlineInfoView from "../../components/OutlineInfoView";
import VehicleMakeModal from "../../components/Modals/VehicleMakeModal";
import VehicleModelModal from "../../components/Modals/VehicleModelModal";

import {
  BLACK,
  FLINT_STONE,
  PINBALL,
  TROLLEY_GREY,
  WHITE,
} from "../../constants/colors";
import { screenRem, widthRem } from "../../constants/dimensions";
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../constants/fonts";
import useApiHook from "../../hooks/rest/useApi";
import useDisplayModal from "../../hooks/useDisplayModal";
import {
  mapMakes,
  mapModels,
  getModelsByMakeId,
  showSnackDanger,
} from "../../utils/functions";
import Entypo from "react-native-vector-icons/Entypo";
import images from "../../constants/images";
import FastImage from "react-native-fast-image";

const EditVehicle = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { handleRestApi, restApiLoading } = useApiHook();
  const { auth, manufactures } = useSelector((state) => state);
  const [vehicleMakeModal, toggleVehicleMakeModal] = useDisplayModal(false);
  const [vehicleModelModal, toggleVehicleModelModal] = useDisplayModal(false);

  const USER_ID = auth?.user?._id;
  const VEHICLE = route?.params?.vehicle;

  const [make, setMake] = useState({});
  const [model, setModel] = useState({});
  const [makeList] = useState(mapMakes(manufactures?.manufactures));
  const [_, setModelList, modelListRef] = useState([]);
  const [range, setRange] = useState(``);

  const handleVehicleMakeSelection = (value) => {
    toggleVehicleMakeModal();
    setMake(value);
    setModel({});
    setModelList(mapModels(value?.models));
  };

  const handleVehicleModelSelection = (value) => {
    setModel(value);
    setRange(value.range);
    toggleVehicleModelModal();
  };

  const editVehicle = async () => {
    Keyboard.dismiss();
    if (isEmpty(make)) {
      showSnackDanger(`Vehicle make cannot be empty`);
      return;
    }

    if (isEmpty(model)) {
      showSnackDanger(`Vehicle model cannot be empty`);
      return;
    }

    if (range === ``) {
      showSnackDanger(`Vehicle range cannot be empty`);
      return;
    } else if (
      range === "0" ||
      range === 0 ||
      range === "00" ||
      range === "000" ||
      range === "0000"
    ) {
      showSnackDanger("Range cannot be 0. Please enter a valid value.");
      return;
    }

    const data = {
      make: make?.value,
      model: model?.value,
      range: range,
    };

    const response = await handleRestApi({
      method: "patch",
      url: `vehicle/${USER_ID}/${VEHICLE?._id}`,
      data,
    });

    if (response?.status === 200) {
      navigation.goBack();
    }
  };

  const getVehicle = async () => {
    const data = VEHICLE;

    const make = {
      label: data?.make?.name,
      value: data?.make?._id,
      models: data?.model,
    };

    const model = {
      label: data?.model?.model,
      value: data?.model?._id,
      range: data?.range,
    };

    setMake(make);
    setModel(model);
    setModelList(getModelsByMakeId(manufactures.manufactures, data?.make?._id));
    setRange(data?.range);
  };

  useEffect(() => {
    getVehicle();
  }, []);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      {restApiLoading && <Loader />}

      <VehicleMakeModal
        leftIcon={
          <Pressable style={styles.leftIcon} onPress={toggleVehicleMakeModal}>
            <ArrowLeft size={screenRem * 1.6} color={BLACK} />
          </Pressable>
        }
        isVisible={vehicleMakeModal}
        label={`Select Make`}
        closeModal={handleVehicleMakeSelection}
        data={makeList}
      />

      <VehicleModelModal
        leftIcon={
          <Pressable style={styles.leftIcon} onPress={toggleVehicleModelModal}>
            <ArrowLeft size={screenRem * 1.6} color={BLACK} />
          </Pressable>
        }
        isVisible={vehicleModelModal}
        label={`Select Model`}
        closeModal={handleVehicleModelSelection}
        data={modelListRef.current}
      />

      <PrimaryHeader
        label={`Edit Vehicle`}
        displayBackButton={true}
        color={BLACK}
        onBackButtonPress={goBack}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.rootContainer}>
            <FastImage
              source={images.vehicle}
              style={{
                height: screenRem * 22,
                width: screenRem * 22,
              }}
              resizeMode={"contain"}
            />

            <OutlineInfoView
              label={`Make`}
              value={make?.label}
              onPress={toggleVehicleMakeModal}
              right={
                <Entypo
                  name="chevron-thin-down"
                  size={screenRem * 1.6}
                  color={TROLLEY_GREY}
                />
              }
            />

            <VerticalSpace h={2} />

            <OutlineInfoView
              label={`Model`}
              value={model?.label}
              onPress={toggleVehicleModelModal}
              right={
                <Entypo
                  name="chevron-thin-down"
                  size={screenRem * 1.6}
                  color={TROLLEY_GREY}
                />
              }
            />

            <VerticalSpace h={2} />

            <OutlineTextInput
              placeholder={`Range (kWh)`}
              value={range.toString()}
              onChangeText={(val) => setRange(val)}
              maxLength={4}
              keyboardType={`numeric`}
            />

            <VerticalSpace h={2} />

            <SolidButton
              label={`Save Vehicle`}
              size={`xl`}
              onPress={editVehicle}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditVehicle;

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  rootContainer: { flex: 1, alignItems: "center" },
  makeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  makeText: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.8,
  },
  modelText: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.2,
    color: FLINT_STONE,
  },
  leftIcon: {
    marginRight: widthRem * 2,
  },
});
