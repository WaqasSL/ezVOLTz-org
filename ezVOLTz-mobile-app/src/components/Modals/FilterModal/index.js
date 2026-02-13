import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  SafeAreaView,
  Pressable,
  Platform,
} from "react-native";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-native-modal";
import { ArrowLeft, ArrowRight, ArrowRight2 } from "iconsax-react-native";

import VerticalSpace from "../../../components/VerticalSpace";
import Line from "../../../components/Line";
import SwitchController from "../../../components/SwitchController";
import SolidButton from "../../../components/Buttons/SolidButton";
import SingleSelect from "../../../components/SingleSelect";
import HorizontalSpace from "../../../components/HorizontalSpace";
import TextButton from "../../../components/Buttons/TextButton";
import MultiSelect from "../../../components/MultiSelect";

import {
  screenRem,
  widthRem,
  width,
  height,
  heightRem,
} from "../../../constants/dimensions";
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_SEMIBOLD,
} from "../../../constants/fonts";
import { ownerTypeData, fuelTypeData } from "../../../constants/miscellaneous";
import { setFilterFields } from "../../../redux/slices/filter/slice";
import { BLACK, BLUE_LOBSTER, WHITE } from "../../../constants/colors";
import useDisplayModal from "../../../hooks/useDisplayModal";
import FilterAccordian from "../../Accordian/FilterAccordian";

const FilterModal = ({
  isVisible,
  closeModal,
  onApplyFilter,
  onClearFilter,
}) => {
  const { filter } = useSelector((state) => state);
  const [isNetworkType, toggleNetworkType] = useDisplayModal(false);
  const [isConnectorType, toggleConnectorType] = useDisplayModal(false);
  const [isOwnerType, toggleOwnerType] = useDisplayModal(false);
  const [isFuelType, toggleFuelType] = useDisplayModal(false);
  const [isEdit, setIsEdit] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (filter.showPrivateStations === !filter.showPrivateStations) {
      setIsEdit(true);
    }
  }, [filter]);

  return (
    <Modal
      isVisible={isVisible}
      style={styles.modal}
      backdropTransitionOutTiming={0}
    >
      <SafeAreaView style={styles.safeAreaViewContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeftContainer}>
            <Pressable onPress={closeModal}>
              <ArrowLeft size={screenRem * 1.8} color={BLACK} />
            </Pressable>
            <HorizontalSpace w={4} />
            <Text style={styles.headerText}>Filter</Text>
          </View>

          <TextButton
            label={`Clear Filter`}
            customTextStyle={{ color: BLUE_LOBSTER }}
            onPress={onClearFilter}
          />
        </View>

        <View style={styles.container}>
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              style={{ marginBottom: heightRem * 2 }}
            >
              <VerticalSpace h={2} />
              <FilterAccordian
                label={"Network Type"}
                hint={"(Scroll for more)"}
                onPress={toggleNetworkType}
                isVisible={isNetworkType}
              />

              {isNetworkType && (
                <>
                  <VerticalSpace h={2} />

                  <View style={{ height: screenRem * 12 }}>
                    <ScrollView
                      persistentScrollbar={true}
                      nestedScrollEnabled={true}
                    >
                      <MultiSelect
                        data={filter.network}
                        getSelectedItem={(val) =>
                          dispatch(setFilterFields({ network: val }))
                        }
                      />
                    </ScrollView>
                  </View>
                </>
              )}

              <VerticalSpace h={2} />
              <Line />
              <VerticalSpace h={2} />
              <View style={styles.toggleSwitchContainer}>
                <Text style={styles.sectionHeadingText}>
                  Show private stations
                </Text>

                <SwitchController
                  value={filter.showPrivateStations}
                  onToggle={(val) =>
                    dispatch(setFilterFields({ showPrivateStations: val }))
                  }
                />
              </View>
              <VerticalSpace h={2} />
              <Line />
              <VerticalSpace h={2} />
              <View style={styles.toggleSwitchContainer}>
                <Text style={styles.sectionHeadingText}>
                  Show available stations
                </Text>

                <SwitchController
                  value={filter.showAvailableStations}
                  onToggle={(val) =>
                    dispatch(setFilterFields({ showAvailableStations: val }))
                  }
                />
              </View>
              <VerticalSpace h={2} />
              <Line />
              <VerticalSpace h={2} />

              <FilterAccordian
                label={"Connector Type"}
                onPress={toggleConnectorType}
                isVisible={isConnectorType}
              />
              {isConnectorType && (
                <>
                  <VerticalSpace h={2} />
                  <MultiSelect
                    data={filter.connector}
                    getSelectedItem={(val) =>
                      dispatch(setFilterFields({ connector: val }))
                    }
                  />
                </>
              )}
              <VerticalSpace h={2} />
              <Line />
              <VerticalSpace h={2} />
              <FilterAccordian
                label={"Owner Type"}
                onPress={toggleOwnerType}
                isVisible={isOwnerType}
              />

              {isOwnerType && (
                <>
                  <VerticalSpace h={2} />
                  <SingleSelect
                    data={ownerTypeData}
                    value={filter.owner}
                    getSelectedItem={(val) =>
                      dispatch(setFilterFields({ owner: val }))
                    }
                  />
                </>
              )}
              <VerticalSpace h={2} />
              <Line />
              <VerticalSpace h={2} />
              <FilterAccordian
                label={"Fuel Type"}
                onPress={toggleFuelType}
                isVisible={isFuelType}
              />
              {isFuelType && (
                <>
                  <VerticalSpace h={2} />
                  <SingleSelect
                    data={fuelTypeData}
                    value={filter.fuel}
                    getSelectedItem={(val) =>
                      dispatch(setFilterFields({ fuel: val }))
                    }
                  />
                </>
              )}
              <VerticalSpace h={2} />
              <Line />
              <VerticalSpace h={2} />
              <View style={styles.toggleSwitchContainer}>
                <Text style={styles.sectionHeadingText}>
                  Include AC Level 1
                </Text>

                <SwitchController
                  value={filter.incAc1}
                  onToggle={(val) => dispatch(setFilterFields({ incAc1: val }))}
                />
              </View>
              <VerticalSpace h={2} />
              <View style={styles.toggleSwitchContainer}>
                <Text style={styles.sectionHeadingText}>
                  Include AC Level 2
                </Text>

                <SwitchController
                  value={filter.incAc2}
                  onToggle={(val) => dispatch(setFilterFields({ incAc2: val }))}
                />
              </View>
              <VerticalSpace h={2} />
              <View style={styles.toggleSwitchContainer}>
                <Text style={styles.sectionHeadingText}>Include DC Fast</Text>

                <SwitchController
                  value={filter.incDc}
                  onToggle={(val) => dispatch(setFilterFields({ incDc: val }))}
                />
              </View>
            </ScrollView>
            <SolidButton label={`Apply Filter`} onPress={onApplyFilter} />
            <VerticalSpace h={2} />

          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  modal: { margin: 0 },
  safeAreaViewContainer: { width, height, backgroundColor: WHITE },
  container: {
    flex: 1,
    paddingHorizontal: widthRem * 4,
  },
  headerContainer: {
    paddingHorizontal: widthRem * 4,
    paddingVertical: heightRem,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontFamily: BERTIOGASANS_SEMIBOLD,
    fontSize: screenRem * 1.3,
    textTransform: "capitalize",
    bottom: Platform.OS === "android" ? heightRem * 0.2 : 0,
  },
  headerLeftContainer: { flexDirection: "row", alignItems: "center" },
  sectionHeadingText: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.3,
  },
  toggleSwitchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
