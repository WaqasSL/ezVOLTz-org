import React, { useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Linking,
} from "react-native";
import Modal from "react-native-modal";
import { Gallery } from "iconsax-react-native";
import ViewShot from "react-native-view-shot";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

import VerticalSpace from "../../../components/VerticalSpace";

import {
  BLACK,
  FLINT_STONE,
  JASPER_CANE,
  THEME,
  WHITE,
  WHITE_SMOKE,
} from "../../../constants/colors";
import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";
import { CLOSE_GREY } from "../../../assets/icons";
import { EZVOLTZ_LOGO_SECONDARY } from "../../../constants/svg";
import {
  BERTIOGASANS_BOLD,
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../../constants/fonts";
import { formatChargeTime, showSnackSuccess } from "../../../utils/functions";

const ReceiptModal = ({ data, isVisible, closeModal }) => {
  const viewShotRef = useRef();

  const saveReceipt = () => {
    viewShotRef.current.capture().then((uri) => {
      CameraRoll.save(uri)
        .then(() => {
          closeModal();
          setTimeout(() => {
            showSnackSuccess("The receipt has been saved to the gallery");
          }, 500);
        })
        .catch(() => {});
    });
  };

  const handleSaveToGallery = async () => {
    if (Platform.OS === "ios") {
      request(PERMISSIONS.IOS.PHOTO_LIBRARY)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              break;
            case RESULTS.DENIED:
              break;
            case RESULTS.LIMITED:
              Linking.openSettings();
              break;
            case RESULTS.GRANTED:
              saveReceipt();
              break;
            case RESULTS.BLOCKED:
              break;
          }
        })
        .catch(() => {});
    } else {
      request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              break;
            case RESULTS.DENIED:
              break;
            case RESULTS.LIMITED:
              Linking.openSettings();
              break;
            case RESULTS.GRANTED:
              saveReceipt();
              break;
            case RESULTS.BLOCKED:
              break;
          }
        })
        .catch(() => {});
    }
  };

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.rootContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <CLOSE_GREY />
        </TouchableOpacity>

        <VerticalSpace h={2} />

        <ViewShot
          style={{ backgroundColor: WHITE, paddingTop: heightRem * 2 }}
          ref={viewShotRef}
        >
          <View style={styles.appLogo}>
            <EZVOLTZ_LOGO_SECONDARY />
          </View>

          <VerticalSpace h={2} />

          <View style={styles.primaryInfoContainer}>
            <Text style={styles.chargingCompletedText}>Charging Completed</Text>

            <VerticalSpace h={1} />

            <Text style={styles.greyText}>Charging Invoice</Text>

            <VerticalSpace h={1} />

            <Text style={styles.greyText}>
              Transaction ID #{data.transaction.transactionKey}
            </Text>
          </View>

          <VerticalSpace h={2} />

          <View style={styles.greyContainer}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>
                ${data.calculateCharges?.toFixed(2)}
              </Text>

              <VerticalSpace h={1} />

              <Text style={styles.greyText}>Total Price</Text>
            </View>

            <VerticalSpace h={1} />

            <View>
              <View style={styles.detailItemContainer}>
                <Text style={styles.detailItemLabel}>Station ID</Text>
                <Text style={styles.detailItemValue}>
                  {data.transaction.stationBoxId.substring(0, 3)}----
                  {data.transaction.stationBoxId.slice(-4)}
                </Text>
              </View>

              <VerticalSpace h={1} />

              <View style={styles.detailItemContainer}>
                <Text style={styles.detailItemLabel}>Connector Name</Text>
                <Text style={styles.detailItemValue}>
                  {data.transaction.connectorName.substring(0, 4)}----
                  {data.transaction.connectorName.slice(-4)}
                </Text>
              </View>

              <VerticalSpace h={1} />

              <View style={styles.detailItemContainer}>
                <Text style={styles.detailItemLabel}>Start Time</Text>
                <Text style={styles.detailItemValue}>
                  {formatChargeTime(data.transaction.transactionStart)}
                </Text>
              </View>

              <VerticalSpace h={1} />

              <View style={styles.detailItemContainer}>
                <Text style={styles.detailItemLabel}>Stop Time</Text>
                <Text style={styles.detailItemValue}>
                  {formatChargeTime(data.transaction.transactionStop)}
                </Text>
              </View>

              <VerticalSpace h={1} />

              <View style={styles.detailItemContainer}>
                <Text style={styles.detailItemLabel}>Used kW</Text>
                <Text style={styles.detailItemValue}>
                  {data.transaction.kwUsed?.toFixed(2)}
                </Text>
              </View>

              <VerticalSpace h={1} />

              <View style={styles.detailItemContainer}>
                <Text style={styles.detailItemLabel}>Connector Power</Text>
                <Text style={styles.detailItemValue}>
                  {data.transaction.connectorPower}
                </Text>
              </View>

              <VerticalSpace h={1} />

              <View style={styles.detailItemContainer}>
                <Text style={styles.detailItemLabel}>Price Per Minute</Text>
                <Text style={styles.detailItemValue}>
                  {data.priceBand.pricePerMinute}
                </Text>
              </View>

              <VerticalSpace h={1} />

              <View style={styles.detailItemContainer}>
                <Text style={styles.detailItemLabel}>Price kW</Text>
                <Text style={styles.detailItemValue}>
                  {data.priceBand.pricePerKw}
                </Text>
              </View>
            </View>
          </View>
        </ViewShot>
        <TouchableOpacity
          style={styles.saveToGalleryButton}
          onPress={saveReceipt}
        >
          <Gallery color={FLINT_STONE} size={screenRem * 3} />

          <VerticalSpace h={1} />

          <Text style={styles.greyText}>Save to Gallery</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ReceiptModal;

const styles = StyleSheet.create({
  rootContainer: {
    width: widthRem * 92,
    backgroundColor: WHITE,
    alignSelf: "center",
    paddingVertical: heightRem * 2,
  },
  closeButton: { alignSelf: "flex-end", marginRight: widthRem * 4 },
  appLogo: { alignSelf: "center" },
  primaryInfoContainer: {
    alignSelf: "center",
    alignItems: "center",
  },
  chargingCompletedText: {
    color: THEME,
    fontFamily: BERTIOGASANS_BOLD,
    fontSize: screenRem * 1.4,
  },
  greyText: {
    color: FLINT_STONE,
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem,
  },
  priceContainer: { alignSelf: "center", alignItems: "center" },
  priceText: {
    fontFamily: BERTIOGASANS_BOLD,
    fontSize: screenRem * 2.2,
    color: THEME,
  },
  detailItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: JASPER_CANE,
    paddingBottom: heightRem,
  },
  detailItemLabel: {
    fontFamily: BERTIOGASANS_REGULAR,
    color: BLACK,
    fontSize: screenRem * 1.2,
  },
  detailItemValue: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.1,
    color: FLINT_STONE,
  },
  greyContainer: {
    backgroundColor: WHITE_SMOKE,
    paddingHorizontal: widthRem * 4,
    paddingVertical: heightRem * 2,
  },
  saveToGalleryButton: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: heightRem,
  },
});
