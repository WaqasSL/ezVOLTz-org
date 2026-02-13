import React, { useState } from "react";
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
import { useDebounce } from "../../hooks/useDebounce";

const SingleSelect = ({ data, value, getSelectedItem }) => {
  const { debounce } = useDebounce();

  const [slectedIndex, setSelectedIndex] = useState(
    data.findIndex((item) => item.value === value.value)
  );

  const handleSelectedItem = (index) => {
    setSelectedIndex(index);
    getSelectedItem(data[index]);
  };

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <Pressable
          key={index}
          style={styles.selectItem(index, slectedIndex)}
          onPress={() => handleSelectedItem(index)}
        >
          <Text style={styles.labelText}>{item.label}</Text>

          {index === slectedIndex && (
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

export default SingleSelect;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selectItem: (index, slectedIndex) => ({
    paddingVertical: heightRem * 0.6,
    paddingHorizontal: widthRem * 4,
    backgroundColor: index === slectedIndex ? FRIENDLY_BASILISK : JASPER_CANE,
    marginRight: widthRem * 2,
    marginVertical: heightRem / 2,
    borderRadius: width,
    borderWidth: 1,
    borderColor: index === slectedIndex ? THEME : WHITE_SMOKE,
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
