import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import VerticalSpace from "../../../components/VerticalSpace";
import ChargingStatus from "../../../components/ChargingStatus";

import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";
import {
  BLACK,
  FLINT_STONE,
  JASPER_CANE,
  SPANDEX_GREEN,
  WHITE,
} from "../../../constants/colors";
import {
  BERTIOGASANS_BOLD,
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
  BERTIOGASANS_SEMIBOLD,
} from "../../../constants/fonts";
import moment from "moment";

const ChargingActivityCard = ({ data, onPress, onPressCancel }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <Text style={styles.stationNameText}>{data?.chargeBoxId}</Text>

      <VerticalSpace h={1.6} />

      <Text style={styles.connectorNameText}>{data?.connectorName}</Text>
      <VerticalSpace h={1.6} />
      <Text style={{ ...styles.connectorNameText }}>
        Start Time: {moment(data?.startTime).format("MMM DD,YYYY hh:mm")}
      </Text>

      <VerticalSpace h={1.6} />
      <View style={styles.rowContainer}>
        <ChargingStatus status={data.status} />
        {data.status === `preparing` && (
          <Pressable style={styles.statusContainer} onPress={onPressCancel}>
            <Text style={styles.statusText}>Cancel</Text>
          </Pressable>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ChargingActivityCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: WHITE,
    paddingVertical: heightRem * 2,
    paddingHorizontal: widthRem * 6,
    width: widthRem * 92,
    marginBottom: heightRem * 2,
    alignSelf: "center",
    borderRadius: screenRem,
    borderWidth: 1,
    borderColor: JASPER_CANE,
  },
  stationNameText: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.4,
    color: BLACK,
  },
  connectorNameText: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.2,
    color: FLINT_STONE,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusContainer: {
    width: "40%",
    paddingVertical: heightRem * 1.2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: screenRem * 0.5,
    flexDirection: "row",
    backgroundColor: JASPER_CANE,
  },
  statusText: {
    fontFamily: BERTIOGASANS_REGULAR,
    color: BLACK,
    fontSize: screenRem * 1.1,
  },
});
