import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TickCircle } from "iconsax-react-native";

import VerticalSpace from "../../../components/VerticalSpace";

import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";
import {
  BLACK,
  FLINT_STONE,
  JASPER_CANE,
  THEME,
  WHITE,
  WHITE_SMOKE,
} from "../../../constants/colors";
import { CLOSE_GREY } from "../../../assets/icons";
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../../constants/fonts";

const DropdownModal = ({
  data,
  isVisible,
  onCloseModal,
  getSelectedItem,
  label,
  value,
}) => {
  const insets = useSafeAreaInsets();

  const [listData] = useState(data);
  const [slectedIndex, setSelectedIndex] = useState(
    data.findIndex((item) => item?.value === value?.value),
  );

  const handleSelectedItem = (index) => {
    setSelectedIndex(index);
    getSelectedItem(listData[index]);
    onCloseModal();
  };

  return (
    <Modal
      isVisible={isVisible}
      style={styles.modalContainer}
      propagateSwipe={true}
      backdropTransitionOutTiming={0}
    >
      <View style={styles.container(insets)}>
        <View style={styles.headerContainer}>
          <Text style={styles.headingText}>{label}</Text>

          <Pressable onPress={onCloseModal} style={{ padding: 4 }}>
            <CLOSE_GREY height={screenRem * 1.2} width={screenRem * 1.2} />
          </Pressable>
        </View>

        <VerticalSpace h={2} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {listData.map((item, index) => (
            <Pressable
              key={index}
              style={styles.dropdownItem(index, slectedIndex)}
              onPress={() => handleSelectedItem(index)}
            >
              <Text style={styles.dropdownItemText}>{item?.label}</Text>

              {index === slectedIndex ? (
                <TickCircle size={screenRem * 1.4} color={THEME} />
              ) : (
                <TickCircle size={screenRem * 1.4} color={WHITE} />
              )}
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default DropdownModal;

const styles = StyleSheet.create({
  modalContainer: { margin: 0, justifyContent: "flex-end" },
  container: (insets) => ({
    flex: 0.4,
    backgroundColor: WHITE,
    justifyContent: "flex-end",
    paddingBottom: insets.bottom,
    paddingTop: heightRem * 2,
    borderTopLeftRadius: screenRem * 2,
    borderTopRightRadius: screenRem * 2,
  }),
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: widthRem * 6,
    paddingVertical: heightRem,
  },
  headingText: {
    fontSize: screenRem * 1.3,
    fontFamily: BERTIOGASANS_MEDIUM,
    color: BLACK,
  },
  dropdownItem: (index, slectedIndex) => ({
    paddingVertical: heightRem * 2,
    paddingHorizontal: widthRem * 6,
    borderBottomWidth: 1,
    borderBottomColor: JASPER_CANE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: index === slectedIndex ? WHITE_SMOKE : WHITE,
  }),
  dropdownItemText: {
    color: FLINT_STONE,
    fontSize: screenRem * 1.2,
    fontFamily: BERTIOGASANS_REGULAR,
  },
});
