import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { BLACK, FLINT_STONE, WHITE, WHITE_SMOKE } from "../../constants/colors";
import {
  heightRem,
  screenRem,
  width,
  widthRem,
} from "../../constants/dimensions";
import { chargerStatus, saasConnectorStatuBadge } from "../../constants/enum";
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../constants/fonts";
import VerticalSpace from "../VerticalSpace";

export const CustomConnector = ({
  item,
  key,
  onPress,
  STATION,
  USER_ID,
  getStationRetailPrice,
  saasApiLoading,
  restApiLoading,
  stripeInitializeLoading,
  chargingActivityRef,
}) => {
  console.log(
    item.name === chargingActivityRef?.current?.connectorName &&
      chargingActivityRef?.current?.status === "preparing"
      ? chargerStatus[chargingActivityRef?.current?.status]
      : chargingActivityRef?.current?.userId !== USER_ID &&
        item.status === "Charging"
      ? "In-use"
      : chargingActivityRef?.current.userId === USER_ID &&
        item.status === "Charging"
      ? item.status
      : item.status,
  );
  useEffect(() => {
    if (item.status === "SuspendedEV") {
      setTimeout(() => {
        getStationRetailPrice();
      }, 5000);
    }
  }, [item.status]);
  return (
    <TouchableOpacity
      style={styles.connectorTouchableContainer}
      key={key}
      onPress={onPress}
    >
      <View style={styles.connectorDetailContainer}>
        <View style={styles.detailWidthContainer}>
          <Text style={styles.connectorDetailItemLabel}>Connector Name</Text>

          <VerticalSpace h={1} />

          <Text style={styles.connectorDetailItemValue} numberOfLines={1}>
            {item.name}
          </Text>
        </View>

        <View style={styles.detailWidthContainer}>
          <Text style={styles.connectorDetailItemLabel}>Plug Type</Text>

          <VerticalSpace h={1} />

          <Text style={styles.connectorDetailItemValue} numberOfLines={1}>
            {item.plugType}
          </Text>
        </View>
        {restApiLoading || saasApiLoading || stripeInitializeLoading ? null : (
          <View
            style={{
              ...styles.connectorStatusContainer,
              backgroundColor: saasConnectorStatuBadge[item.status],
            }}
          >
            <Text
              style={{
                ...styles.connectorStatusText,
                color: saasConnectorStatuBadge[item.status] ? WHITE : BLACK,
              }}
            >
              {item.name === chargingActivityRef?.current?.connectorName &&
              chargingActivityRef?.current?.status === "preparing"
                ? chargerStatus[chargingActivityRef?.current?.status]
                : chargingActivityRef?.current?.userId !== USER_ID &&
                  item.status === "Charging"
                ? "In-use"
                : chargingActivityRef?.current.userId === USER_ID &&
                  item.status === "Charging"
                ? item.status
                : item.status}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  detailWidthContainer: { width: `33%` },
  startChargingCustomButton: {
    paddingVertical: heightRem * 1.4,
    alignSelf: "center",
  },
  startChargingCustomText: { fontSize: screenRem },
});
