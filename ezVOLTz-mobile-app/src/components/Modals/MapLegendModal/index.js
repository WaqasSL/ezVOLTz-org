import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import VerticalSpace from "../../../components/VerticalSpace";
import HorizontalSpace from "../../../components/HorizontalSpace";

import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";
import { FLINT_STONE, WHITE } from "../../../constants/colors";
import { CLOSE_GREY } from "../../../assets/icons";
import { BERTIOGASANS_MEDIUM } from "../../../constants/fonts";
import {
  LEVEL1,
  LEVEL2,
  PRIVATE,
  DCFAST,
  SLOW,
  TRAFFIC,
} from "../../../assets/icons";

const ICON_SIZE = screenRem * 2.6;

const DATA = [
  {
    label: `Level 1`,
    image: <LEVEL1 height={ICON_SIZE} width={ICON_SIZE} />,
  },
  {
    label: `Level 2`,
    image: <LEVEL2 height={ICON_SIZE} width={ICON_SIZE} />,
  },
  {
    label: `DC Fast`,
    image: <DCFAST height={ICON_SIZE} width={ICON_SIZE} />,
  },
  {
    label: `Private`,
    image: <PRIVATE height={ICON_SIZE} width={ICON_SIZE} />,
  },
  {
    label: `Traffic`,
    image: <TRAFFIC height={ICON_SIZE} width={ICON_SIZE} />,
  },
  {
    label: `Slow`,
    image: <SLOW height={ICON_SIZE} width={ICON_SIZE} />,
  },
];

const MapLegendModal = ({ isVisible, onCloseModal, label }) => {
  const insets = useSafeAreaInsets();

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

        <View style={styles.childContainer}>
          {DATA.map((item, index) => (
            <View key={index} style={styles.mapLegendItem}>
              {item.image}

              <HorizontalSpace w={4} />

              <Text style={styles.mapLegendLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default MapLegendModal;

const styles = StyleSheet.create({
  modalContainer: { margin: 0, justifyContent: "flex-end" },
  container: (insets) => ({
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
    fontSize: screenRem * 1.4,
    fontFamily: BERTIOGASANS_MEDIUM,
  },
  childContainer: {
    paddingHorizontal: widthRem * 4,
    paddingBottom: heightRem * 4,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  mapLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: widthRem * 4,
    marginBottom: heightRem * 2,
  },
  mapLegendLabel: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.2,
    color: FLINT_STONE,
  },
});
