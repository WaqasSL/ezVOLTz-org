import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import VerticalSpace from "../../../components/VerticalSpace";
import Line from "../../../components/Line";

import {
  BERTIOGASANS_BOLD,
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../../constants/fonts";
import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";
import { BLACK, FLINT_STONE, THEME } from "../../../constants/colors";
import moment from "moment";

const NotificationCard = ({ data, handleNotificationOnPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleNotificationOnPress}
    >
      <View style={styles.notificationInfoContainer}>
        <View style={{ width: "92%" }}>
          <Text style={styles.notificationHeadingText}>{data.title}</Text>

          <VerticalSpace h={0.8} />

          <Text style={styles.notificationInfoText}>{data.message}</Text>
        </View>

        {!data.read && <View style={styles.themeDot} />}
      </View>

      <VerticalSpace h={1} />
      <Text style={styles.createdAtText}>
        {moment(data.createdAt).fromNow(true)}
      </Text>
      <VerticalSpace h={1} />

      <Line />
    </TouchableOpacity>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: widthRem * 6,
    marginVertical: heightRem,
  },
  notificationHeadingText: {
    fontSize: screenRem * 1.3,
    fontFamily: BERTIOGASANS_MEDIUM,
    color: BLACK,
  },
  notificationInfoText: {
    fontSize: screenRem * 1.1,
    fontFamily: BERTIOGASANS_REGULAR,
    lineHeight: screenRem * 1.6,
    color: FLINT_STONE,
  },
  notificationInfoBoldText: {
    fontFamily: BERTIOGASANS_BOLD,
  },
  notificationInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  themeDot: {
    height: screenRem * 0.6,
    width: screenRem * 0.6,
    borderRadius: screenRem,
    backgroundColor: THEME,
  },
  createdAtText: {
    fontSize: Platform.OS === "android" ? screenRem : screenRem * 0.9,
    fontFamily: BERTIOGASANS_REGULAR,
    color: FLINT_STONE,
    textTransform: "capitalize",
    alignSelf: "flex-end",
  },
});
