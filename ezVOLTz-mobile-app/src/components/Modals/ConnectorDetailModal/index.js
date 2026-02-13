import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import VerticalSpace from "../../../components/VerticalSpace";
import Line from "../../../components/Line";
import SolidButton from "../../../components/Buttons/SolidButton";

import {
  heightRem,
  screenRem,
  width,
  widthRem,
} from "../../../constants/dimensions";
import {
  BERN_RED,
  BLACK,
  FLINT_STONE,
  JASPER_CANE,
  WHITE,
} from "../../../constants/colors";
import { CLOSE_GREY } from "../../../assets/icons";
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
  BERTIOGASANS_SEMIBOLD,
} from "../../../constants/fonts";
import { chargerStatus, saasConnectorStatuBadge } from "../../../constants/enum";
import { isEmpty, isNull } from "lodash";

const ConnectorDetailModal = ({
  data,
  isVisible,
  onCloseModal,
  label,
  onStartCharging,
  chargingActivity,
  onStopCharging,
  onCancelPreparing
}) => {
  const insets = useSafeAreaInsets();
  const { auth } = useSelector((state) => state);

  let ISGUEST;

  ISGUEST = isEmpty(auth.user);
  ISGUEST = isNull(auth.refreshToken);


  const USER_ID = auth.user._id;


  return (
    <Modal
      isVisible={isVisible}
      style={styles.modalContainer}
      propagateSwipe={true}
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
            <View>
              <Text style={styles.primaryAddressText}>{data.name}</Text>

              <VerticalSpace h={1} />

              <Text style={styles.secondaryAddressText}>{data.plugType}</Text>
            </View>

            <View
              style={{
                ...styles.connectorStatusContainer,
                backgroundColor: saasConnectorStatuBadge[data.status],
              }}
            >
              <Text style={styles.connectorStatusText}>  {data.name === chargingActivity?.connectorName && chargingActivity?.status === 'preparing' ? chargerStatus[chargingActivity?.status] :
                chargingActivity.userId != USER_ID && data.status === 'Charging' ? "In-use" : chargingActivity.userId === USER_ID && data.status === 'Charging' ? data.status : data.status}</Text>
            </View>
          </View>

          <VerticalSpace h={2} />

          <Line />

          <VerticalSpace h={2} />

          <View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: `50%` }}>
                <Text style={styles.detailHeadingText}>Power kWh</Text>

                <VerticalSpace h={1} />

                <Text style={styles.detailValueText}>{data.power}</Text>
              </View>

              <View style={{ width: `50%` }}>
                <Text style={styles.detailHeadingText}>Price kWh</Text>

                <VerticalSpace h={1} />

                <Text style={styles.detailValueText}>${data.priceKwh}</Text>
              </View>
            </View>

            <VerticalSpace h={2} />

            <View style={{ flexDirection: "row" }}>
              <View style={{ width: `50%` }}>
                <Text style={styles.detailHeadingText}>Price Per Minute</Text>

                <VerticalSpace h={1} />

                <Text style={styles.detailValueText}>${data.priceMinute}</Text>
              </View>
            </View>
          </View>

          <VerticalSpace h={4} />

          {data.status === "Available" && chargingActivity?.status !== 'preparing' && (
            <SolidButton
              label={`Start Charging`}
              customButtonStyle={{ backgroundColor: JASPER_CANE }}
              customTextStyle={{ color: BLACK }}
              onPress={onStartCharging}
            />
          )}

          {USER_ID === chargingActivity.userId &&
            data.status === "Charging" && (
              <SolidButton
                label={`Stop Charging`}
                customButtonStyle={{ backgroundColor: JASPER_CANE }}
                customTextStyle={{ color: BLACK }}
                onPress={onStopCharging}
              />
            )}

          {USER_ID === chargingActivity.userId &&
            chargingActivity?.status === 'preparing' && (
              <SolidButton
                label={`Cancel Preparing`}
                customButtonStyle={{ backgroundColor: JASPER_CANE }}
                customTextStyle={{ color: BLACK }}
                onPress={() => onCancelPreparing(data)}
              />
            )}
        </View>
      </View>
    </Modal>
  );
};

export default ConnectorDetailModal;

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

  detailHeadingText: {
    fontFamily: BERTIOGASANS_REGULAR,
    color: FLINT_STONE,
    fontSize: screenRem * 1.2,
  },
  detailValueText: {
    fontFamily: BERTIOGASANS_SEMIBOLD,
    fontSize: screenRem * 1.2,
  },
  connectorStatusContainer: {
    paddingVertical: heightRem,
    paddingHorizontal: widthRem * 4,
    borderRadius: width,
  },
  connectorStatusText: {
    fontFamily: BERTIOGASANS_REGULAR,
    color: WHITE,
    fontSize: screenRem,
  },
});
