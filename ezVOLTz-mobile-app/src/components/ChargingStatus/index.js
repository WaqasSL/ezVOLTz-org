import { InfoCircle, TickCircle } from "iconsax-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import HorizontalSpace from "../HorizontalSpace";

import { BLACK, JASPER_CANE, SPANDEX_GREEN, VITAMIN_C, WHITE } from "../../constants/colors";
import { heightRem, screenRem } from "../../constants/dimensions";
import { BERTIOGASANS_REGULAR } from "../../constants/fonts";
import { chargerStatus, chargerStatusBgColor, chargerStatusIconColor, chargerStatusTextColor } from "../../constants/enum";

const ChargingStatus = ({ status }) => {
  return (
    <View
      style={{
        ...styles.statusContainer,
        backgroundColor: chargerStatusBgColor[status],
      }}
    >
      {status === `charged` ? (
        <TickCircle color={chargerStatusIconColor[status]} size={screenRem * 1.6} />
      ) : (
        <InfoCircle color={chargerStatusIconColor[status]} size={screenRem * 1.6} />
      )}

      <HorizontalSpace w={2} />

      <Text style={styles.statusText(status)}>
        {chargerStatus[status]}
      </Text>
    </View>
  );
};

export default ChargingStatus;

const styles = StyleSheet.create({
  statusContainer: {
    width: "36%",
    paddingVertical: heightRem * 0.8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: screenRem * 0.5,
    flexDirection: "row",
  },
  statusText: (status) => ({
    fontFamily: BERTIOGASANS_REGULAR,
    color: chargerStatusTextColor[status],
    fontSize: screenRem,
  }),
});
