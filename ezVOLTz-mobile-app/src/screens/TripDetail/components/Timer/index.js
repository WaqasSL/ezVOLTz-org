import { Clock } from "iconsax-react-native";
import React from "react";
import { View, StyleSheet, Text } from "react-native";

import HorizontalSpace from "../../../../components/HorizontalSpace";

import {
  BLACK_GREY,
  JASPER_CANE,
  WHITE_SMOKE,
} from "../../../../constants/colors";
import {
  heightRem,
  screenRem,
  widthRem,
} from "../../../../constants/dimensions";
import { BERTIOGASANS_REGULAR } from "../../../../constants/fonts";
import { dateComing } from "../../../../utils/functions";
import useTimer from "../../../../hooks/useTimer";

const Timer = ({ data }) => {
  const remainingTime = dateComing(
    data?.startDate && data?.startTime
      ? data?.startTime
      : data?.startDate &&
        new Date(data?.startDate).getDate() === new Date().getDate() &&
        new Date(data?.startDate).getMonth() === new Date().getMonth() &&
        new Date(data?.startDate).getFullYear() === new Date().getFullYear()
      ? new Date(new Date(new Date().setHours(23)).setMinutes(59))
      : data?.startDate
  );

  const [days, hours, minutes, seconds] = useTimer(
    data?.startDate && data?.startTime
      ? data?.startTime
      : data?.startDate
      ? new Date(new Date(new Date().setHours(23)).setMinutes(59))
      : null
  );

  return (
    <View style={styles.container}>
      <Clock size={screenRem * 1.2} color={BLACK_GREY} />

      <HorizontalSpace w={2} />

      <Text style={styles.timeText}>
        {remainingTime?.includes("day") ||
        remainingTime?.includes("month") ||
        remainingTime?.includes("year") ? (
          <>
            {data?.startDate
              ? `${remainingTime.trim().replace(/d/, "D")} To Go`
              : `Not Scheduled`}
          </>
        ) : (
          <>
            {days < 0 && hours < 0 && minutes < 0 && seconds < 0
              ? `0:0:0:0`
              : ` ${days}d, ${hours}h, ${minutes} m, ${seconds}s`}
          </>
        )}
      </Text>
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE_SMOKE,
    borderWidth: 1,
    paddingHorizontal: widthRem * 3,
    paddingVertical: heightRem * 1.2,
    borderColor: JASPER_CANE,
    borderRadius: screenRem,
  },
  timeText: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem,
    color: BLACK_GREY,
  },
});
