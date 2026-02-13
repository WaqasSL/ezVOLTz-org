import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Add } from "iconsax-react-native";

import VerticalSpace from "../../../components/VerticalSpace";
import Line from "../../../components/Line";

import {
  heightRem,
  screenRem,
  width,
  widthRem,
} from "../../../constants/dimensions";
import { FLINT_STONE, THEME, WHITE } from "../../../constants/colors";
import { CLOSE_GREY } from "../../../assets/icons";
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
  BERTIOGASANS_SEMIBOLD,
} from "../../../constants/fonts";
import { chargingStationStatus } from "../../../constants/enum";

const AddStopModal = ({
  data,
  isVisible,
  onCloseModal,
  getSelectedItem,
  label,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      isVisible={isVisible}
      style={styles.modalContainer}
      propagateSwipe={true}
      backdropTransitionOutTiming={0}
    >
      <View style={styles.container(insets)}>
        <View style={styles.headerContainer}>
          <Text style={styles.headingText}>{label}</Text>

          <Pressable onPress={onCloseModal} style={{ padding: 4 }}>
            <CLOSE_GREY height={screenRem * 1.2} width={screenRem * 1.2} />
          </Pressable>
        </View>

        <VerticalSpace h={2} />

        <View style={styles.detailsContaienr}>
          <View style={styles.addressContainer}>
            <View style={{ width: `80%` }}>
              <Text style={styles.primaryAddressText}>
                {data?.station_name}
              </Text>

              <VerticalSpace h={1} />

              <Text style={styles.secondaryAddressText}>
                {data?.street_address}, {data?.zip} {data?.city}, {data?.state},{" "}
                {data?.country}
              </Text>
            </View>

            <Pressable style={styles.addButton} onPress={getSelectedItem}>
              <Add size={screenRem * 2} color={WHITE} />
            </Pressable>
          </View>

          <VerticalSpace h={2} />

          <Line />

          <VerticalSpace h={2} />

          <View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: `50%` }}>
                <Text style={styles.detailHeadingText}>Connector Type</Text>

                <VerticalSpace h={1} />

                <Text style={styles.detailValueText}>
                  {data?.ev_level1_evse_num
                    ? "Level 1"
                    : data?.ev_dc_fast_num
                      ? "Fast Charger"
                      : data?.ev_level2_evse_num
                        ? "Level 2"
                        : "N/A"}
                </Text>
              </View>

              <View style={{ width: `50%` }}>
                <Text style={styles.detailHeadingText}>Access</Text>

                <VerticalSpace h={1} />

                <Text style={styles.detailValueText}>{data?.access_code}</Text>
              </View>
            </View>

            <VerticalSpace h={2} />

            <View style={{ flexDirection: "row" }}>
              <View style={{ width: `50%` }}>
                <Text style={styles.detailHeadingText}>Charging Network</Text>

                <VerticalSpace h={1} />

                <Text style={styles.detailValueText}>
                  {data?.ev_network || `N/A`}
                </Text>
              </View>

              <View style={{ width: `50%` }}>
                <Text style={styles.detailHeadingText}>Status</Text>

                <VerticalSpace h={1} />

                <Text style={styles.detailValueText}>
                  {chargingStationStatus[data?.status_code]}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddStopModal;

const styles = StyleSheet.create({
  modalContainer: { margin: 0, justifyContent: "flex-end" },
  container: (insets) => ({
    backgroundColor: WHITE,
    justifyContent: "flex-end",
    paddingBottom: insets.bottom + heightRem * 2,
    paddingTop: heightRem * 2,
    borderTopLeftRadius: screenRem * 2,
    borderTopRightRadius: screenRem * 2,
  }),
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: widthRem * 6,
    paddingVertical: heightRem,
  },
  headingText: {
    fontSize: screenRem * 1.3,
    fontFamily: BERTIOGASANS_MEDIUM,
  },
  detailsContaienr: {
    paddingHorizontal: widthRem * 6,
    paddingVertical: heightRem,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryAddressText: {
    fontFamily: BERTIOGASANS_SEMIBOLD,
    fontSize: screenRem * 1.6,
  },
  secondaryAddressText: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.2,
    color: FLINT_STONE,
  },
  addButton: {
    backgroundColor: THEME,
    padding: screenRem * 0.8,
    borderRadius: width,
  },
  detailHeadingText: {
    fontFamily: BERTIOGASANS_REGULAR,
    color: FLINT_STONE,
    fontSize: screenRem * 1.2,
  },
  detailValueText: {
    fontFamily: BERTIOGASANS_SEMIBOLD,
    fontSize: screenRem * 1.2,
  },
});
