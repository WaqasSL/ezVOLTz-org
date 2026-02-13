import React from "react";
import ToggleSwitch from "toggle-switch-react-native";

import { THEME, WILD_DOVE } from "../../constants/colors";

const SwitchController = ({ value, onToggle }) => {
  return (
    <ToggleSwitch
      isOn={value}
      onColor={THEME}
      offColor={WILD_DOVE}
      size={`medium`}
      onToggle={onToggle}
    />
  );
};

export default SwitchController;
