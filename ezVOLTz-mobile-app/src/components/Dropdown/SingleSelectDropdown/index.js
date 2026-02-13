import React from "react";
import { View } from "react-native";
import { isEmpty } from "lodash";

import PickerPanel from "../../../components/PickerPanel";
import DropdownModal from "../../../components/Modals/DropdownModal";

const SingleSelectDropdown = ({
  label,
  data,
  isVisible,
  getSelectedItem,
  value,
  leftIcon,
  rightIcon,
  toggleSingleSelectDropdown,
}) => {
  return (
    <View>
      <DropdownModal
        label={label}
        data={data}
        isVisible={isVisible}
        onCloseModal={toggleSingleSelectDropdown}
        getSelectedItem={getSelectedItem}
        value={value}
      />
      <PickerPanel
        label={!isEmpty(value) ? value.label : label}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        onPickerPanelPress={toggleSingleSelectDropdown}
      />
    </View>
  );
};

export default SingleSelectDropdown;
