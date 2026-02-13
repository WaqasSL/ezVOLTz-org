import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import useState from "react-usestateref";
import { useSelector } from "react-redux";
import { isEmpty, isUndefined } from "lodash";

import VerticalSpace from "../../components/VerticalSpace";
import PrimaryHeader from "../../components/Headers/PrimaryHeader";
import HorizontalSpace from "../../components/HorizontalSpace";
import SolidButton from "../../components/Buttons/SolidButton";
import OutlineTextInput from "../../components/TextInputs/OutlineTextInput";
import VehicleMakeModal from "../../components/Modals/VehicleMakeModal";
import VehicleModelModal from "../../components/Modals/VehicleModelModal";
import Loader from "../../components/Loader";

import { BLACK, FLINT_STONE, WHITE } from "../../constants/colors";
import { screenRem, widthRem } from "../../constants/dimensions";
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../constants/fonts";
import { ArrowLeft } from "iconsax-react-native";
import useDisplayModal from "../../hooks/useDisplayModal";
import useApiHook from "../../hooks/rest/useApi";
import { mapMakes, mapModels, showSnackDanger } from "../../utils/functions";
import images from "../../constants/images";
import FastImage from "react-native-fast-image";

const AddVehicle = () => {
  const navigation = useNavigation();
  const [vehicleMakeModal, toggleVehicleMakeModal] = useDisplayModal(true);
  const [vehicleModelModal, toggleVehicleModelModal] = useDisplayModal(false);
  const { handleRestApi, restApiLoading } = useApiHook();
  const { auth, manufactures } = useSelector((state) => state);

  const USER_ID = auth?.user?._id;

  const [make, setMake] = useState({});
  const [model, setModel] = useState({});
  const [makeList] = useState(mapMakes(manufactures?.manufactures));
  const [_, setModelList, modelListRef] = useState([]);
  const [range, setRange] = useState(``);

  const handleVehicleMakeSelection = (value) => {
    toggleVehicleMakeModal();
    setMake(value);
    setModelList(mapModels(value?.models));
    const timer = setTimeout(() => {
      toggleVehicleModelModal();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  };

  const handleVehicleModelSelection = (value) => {
    setModel(value);
    setRange(value.range);
    toggleVehicleModelModal();
  };

  const addVehicle = async () => {
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
      range: range.toString(),
      userId: USER_ID,
    };

    const response = await handleRestApi({
      method: "post",
      url: `vehicle`,
      data,
    });

    if (response?.status === 201) {
      navigation.goBack();
    }
  };

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      {restApiLoading && <Loader />}

      <VehicleMakeModal
        leftIcon={
          <Pressable style={styles.leftIcon} onPress={goBack}>
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
          <Pressable style={styles.leftIcon} onPress={goBack}>
            <ArrowLeft size={screenRem * 1.6} color={BLACK} />
          </Pressable>
        }
        isVisible={vehicleModelModal}
        label={`Select Model`}
        closeModal={handleVehicleModelSelection}
        data={modelListRef.current}
      />

      <PrimaryHeader
        label={`Select Model`}
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
          keyboardShouldPersistTaps="alwayss"
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

            <Text style={styles.makeText}>{make?.label}</Text>

            <VerticalSpace h={2} />

            <Text style={styles.modelText}>{model?.label}</Text>

            <VerticalSpace h={4} />

            {!isUndefined(model?.range) && (
              <View>
                <OutlineTextInput
                  placeholder={`Range (kWh)`}
                  value={`${range}`}
                  onChangeText={(val) => setRange(val)}
                  maxLength={4}
                  keyboardType={`numeric`}
                />
              </View>
            )}

            <VerticalSpace h={2} />

            {!isEmpty(make) && !isEmpty(model) && (
              <SolidButton
                label={`Save Vehicle`}
                size={`xl`}
                onPress={addVehicle}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddVehicle;

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  rootContainer: { flex: 1, alignItems: "center" },
  makeText: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.8,
    color: BLACK,
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
