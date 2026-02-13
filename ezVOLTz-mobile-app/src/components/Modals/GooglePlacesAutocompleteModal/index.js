import React from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { View } from "react-native";
import { ArrowRotateLeft, Location } from "iconsax-react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import ModalWrapper from "../ModalWrapper";
import HorizontalSpace from "../../../components/HorizontalSpace";

import {
  width,
  screenRem,
  widthRem,
  heightRem,
} from "../../../constants/dimensions";
import {
  BLUE_LOBSTER,
  FLINT_STONE,
  JASPER_CANE,
  WILD_DOVE,
} from "../../../constants/colors";
import { BERTIOGASANS_REGULAR } from "../../../constants/fonts";
import { GOOGLE_KEY } from "@env";
import Line from "../../Line";

const GooglePlacesAutocompleteModal = ({
  label,
  isVisible,
  closeModal,
  onSelectLocation,
  recentSearches,
  autoFocus,
  handleSelectCurrentLocation,
  locationType,
}) => {
  const renderRecentSearches = (description) => (
    <View style={styles.descriptionContainer}>
      <ArrowRotateLeft color={WILD_DOVE} size={screenRem * 1.4} />
      <HorizontalSpace w={4} />
      <Text style={styles.description}>{description}</Text>
    </View>
  );

  const renderSearchedLocations = (description) => (
    <View style={styles.descriptionContainer}>
      <Location color={WILD_DOVE} size={screenRem * 1.4} />
      <HorizontalSpace w={4} />
      <Text style={styles.description}>{description}</Text>
    </View>
  );
  return (
    <ModalWrapper
      isVisible={isVisible}
      closeModal={closeModal}
      label={label}
      displayCloseButton={true}
    >
      <View style={styles.googlePlaceAutoCompleteContainer}>
        <GooglePlacesAutocomplete
          fetchDetails={true}
          keepResultsAfterBlur={false}
          listViewDisplayed={false}
          placeholder="Search Location"
          query={{
            key: GOOGLE_KEY,
            language: "en",
          }}
          onPress={onSelectLocation}
          styles={{
            textInput: styles.textInput,
            textInputContainer: styles.textInputContainer,
            poweredContainer: styles.poweredContainer,
            row: styles.row,
            description: styles.description,
            separator: styles.separator,
            powered: styles.powered,
            listView: {
              backgroundColor: "white",
              zIndex: 1,
            },
          }}
          textInputProps={{
            autoFocus,
          }}
        />
        <View style={styles.predefinedPlace}>
          {locationType === "origin" && (
            <>
              <Pressable
                style={styles.descriptionContainer}
                onPress={handleSelectCurrentLocation}
              >
                <Location color={BLUE_LOBSTER} size={screenRem * 1.4} />
                <HorizontalSpace w={4} />
                <Text style={{ ...styles.description, color: BLUE_LOBSTER }}>
                  Current Location
                </Text>
              </Pressable>
              {recentSearches?.length > 0 &&
                <Line />}
            </>
          )}
          <FlatList
            data={recentSearches}
            nestedScrollEnabled
            keyExtractor={(item, index) => item.id}
            ItemSeparatorComponent={() => <Line />}
            renderItem={({ item, index }) => (
              <ScrollView horizontal>
                <Pressable
                  onPress={() => {
                    onSelectLocation(item, item);
                  }}
                >
                  {item.isPredefinedPlace
                    ? renderRecentSearches(item.description)
                    : renderSearchedLocations(item.description)}
                </Pressable>
              </ScrollView>

            )}
            showsVerticalScrollIndicator={false}
            style={{
              marginBottom: heightRem,
            }}
          />
        </View>
      </View>
    </ModalWrapper>
  );
};

export default GooglePlacesAutocompleteModal;

const styles = StyleSheet.create({
  googlePlaceAutoCompleteContainer: {
    flex: 1,
    paddingHorizontal: widthRem * 4,
  },
  textInput: {
    fontSize: screenRem * 1.1,
    backgroundColor: "transparent",
    paddingBottom: heightRem
  },
  textInputContainer: {
    borderWidth: 1,
    borderRadius: screenRem * 4,
    paddingHorizontal: widthRem * 2,
    borderColor: JASPER_CANE,
    height: heightRem * 5,
  },
  poweredContainer: {
    backgroundColor: "transparent",
  },
  row: {
    paddingVertical: screenRem,
  },
  description: {
    fontSize: screenRem * 1.2,
    fontFamily: BERTIOGASANS_REGULAR,
    color: FLINT_STONE,
  },
  separator: {
    // backgroundColor: `transparent`,
  },
  powered: {
    height: 0,
    width: 0,
  },
  getCurrentLocationButton: (insets) => ({
    position: "absolute",
    bottom: insets.bottom + heightRem * 2,
    right: widthRem * 4,
    padding: screenRem * 0.8,
    borderWidth: 1,
    borderRadius: width,
    borderColor: JASPER_CANE,
  }),
  currentLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: screenRem * 1.1,
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: heightRem * 1.4,
  },
  predefinedPlace: {
    position: "absolute",
    top: heightRem * 6,
    left: widthRem * 6,
    zIndex: -1,
    width: widthRem * 88,
  },
});
