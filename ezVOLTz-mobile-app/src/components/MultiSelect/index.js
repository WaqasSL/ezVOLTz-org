import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import HorizontalSpace from "../../components/HorizontalSpace";

import {
  FRIENDLY_BASILISK,
  JASPER_CANE,
  THEME,
  WHITE_SMOKE,
} from "../../constants/colors";
import {
  heightRem,
  screenRem,
  width,
  widthRem,
} from "../../constants/dimensions";

const MultiSelect = ({ data, getSelectedItem }) => {

  const handleSelectedItems = (index) => {
    const updatedData = [...data];

    updatedData[index] = {
      ...updatedData[index],
      isSelected: !updatedData[index].isSelected,
    };

    getSelectedItem(updatedData);
  };

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <Pressable
          key={index}
          style={styles.selectItem(item.isSelected)}
          onPress={() => handleSelectedItems(index)}
        >
          <Text style={styles.labelText}>{item.label}</Text>

          {item.isSelected && (
            <>
              <HorizontalSpace w={2} />

              <View style={styles.themeDot} />
            </>
          )}
        </Pressable>
      ))}
    </View>
  );
};

export default MultiSelect;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selectItem: (isSelected) => ({
    paddingVertical: heightRem * 0.6,
    paddingHorizontal: widthRem * 4,
    backgroundColor: isSelected ? FRIENDLY_BASILISK : JASPER_CANE,
    marginRight: widthRem * 2,
    marginVertical: heightRem / 2,
    borderRadius: width,
    borderWidth: 1,
    borderColor: isSelected ? THEME : WHITE_SMOKE,
    flexDirection: "row",
    alignItems: "center",
  }),
  labelText: { fontSize: screenRem },
  themeDot: {
    height: screenRem / 1.4,
    width: screenRem / 1.4,
    borderRadius: width,
    backgroundColor: THEME,
  },
});
