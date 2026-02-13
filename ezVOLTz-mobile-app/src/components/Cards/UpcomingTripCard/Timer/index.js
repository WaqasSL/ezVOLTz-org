import React from "react";
import { Text } from "react-native";

import useTimer from "../../../../hooks/useTimer";

const Timer = ({ time }) => {
  const [days, hours, minutes, seconds] = useTimer(time);

  return (
    <>
      {days < 0 && hours < 0 && minutes < 0 && seconds < 0
        ? `0:0:0:0`
        : ` ${days}d, ${hours}h, ${minutes} m, ${seconds}s`}
    </>
  );
};

export default Timer;
