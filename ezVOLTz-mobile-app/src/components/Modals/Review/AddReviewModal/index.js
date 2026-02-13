import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Keyboard,
  Image,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import { Add, MinusCirlce } from "iconsax-react-native";
import { Rating } from "react-native-ratings";
import { launchImageLibrary } from "react-native-image-picker";
import { isEmpty } from "lodash";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import ModalWrapper from "../../ModalWrapper";
import VerticalSpace from "../../../../components/VerticalSpace";
import TextArea from "../../../../components/TextArea";
import Dropzone from "../../../../components/Dropzone";
import SolidButton from "../../../../components/Buttons/SolidButton";

import {
  heightRem,
  screenRem,
  widthRem,
} from "../../../../constants/dimensions";
import { BERTIOGASANS_MEDIUM } from "../../../../constants/fonts";
import { multiImageOptions } from "../../../../constants/miscellaneous";
import { showSnackDanger } from "../../../../utils/functions";
import { BERN_RED, THEME } from "../../../../constants/colors";

const AddReviewModal = ({
  isVisible,
  closeModal,
  label,
  displayCloseButton,
  onSubmitReview,
}) => {
  const initialState = {
    rating: 2,
    comment: ``,
    images: [],
  };
  const [review, setReview] = useState(initialState);

  const handleAddImages = async () => {
    Keyboard.dismiss();

    launchImageLibrary(multiImageOptions, (response) => {
      if (response.didCancel) {
      } else if (response.errorCode) {
        showSnackDanger(
          "This seems to be having an issue with this image, please select another one."
        );
      } else if (
        response?.assets[0].height === 0 ||
        response?.assets[0].width === 0
      ) {
        showSnackDanger(
          "This seems to be having an issue with this image, please select another one."
        );
      } else {
        let sum = review.images.length + response?.assets.length;
        if (sum > 5) {
          showSnackDanger("Only 5 images can be uplaoded.");
        } else {
          const combinedImages = [...review.images, ...response?.assets];

          const filteredImages = Array.from(
            new Set(combinedImages.map((a) => a.fileSize))
          ).map((fileSize) => {
            return combinedImages.find((b) => b.fileSize === fileSize);
          });

          setReview({ ...review, images: filteredImages });
        }
      }
    });
  };

  const handleRemoveImage = (index) => {
    const updatedItems = review.images.filter((_, idx) => idx !== index);
    setReview({ ...review, images: updatedItems });
  };

  const handleAddReview = () => {
    Keyboard.dismiss();

    if (review.comment === ``) {
      showSnackDanger(`Additional comment message cannot be empty`);
    } else if (review.images > 0) {
      showSnackDanger(`Only 5 images are allowed`);
    } else {
      onSubmitReview(review);
    }
  };

  const onCloseModal = () => {
    setReview(initialState);
    closeModal();
  };

  return (
    <ModalWrapper
      isVisible={isVisible}
      closeModal={onCloseModal}
      label={label}
      displayCloseButton={displayCloseButton}
      backdropTransitionOutTiming={0}
    >
      <KeyboardAwareScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.container}>
          <Text style={styles.labelText}>Please rate your experience</Text>

          <VerticalSpace h={2} />

          <Rating
            fractions={1}
            style={{ alignSelf: "flex-start" }}
            ratingCount={5}
            imageSize={screenRem * 1.6}
            startingValue={review.rating}
            onFinishRating={(val) => setReview({ ...review, rating: val })}
          />

          <VerticalSpace h={2} />

          <Text style={styles.labelText}>Additional comment</Text>

          <VerticalSpace h={2} />

          <TextArea
            placeholder={`Message`}
            value={review.comment}
            onChangeText={(val) => setReview({ ...review, comment: val })}
          />

          <VerticalSpace h={2} />

          <Text style={styles.labelText}>Add images</Text>

          <VerticalSpace h={2} />

          <View>
            {!isEmpty(review.images) ? (
              <View style={styles.imagesContainer}>
                {review.images.map((item, index) => (
                  <View style={styles.imageContainer} key={index}>
                    <Image style={styles.image} source={{ uri: item.uri }} />

                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <MinusCirlce
                        size={screenRem * 2}
                        color={BERN_RED}
                        variant="Bold"
                      />
                    </TouchableOpacity>
                  </View>
                ))}

                {review.images.length < 5 && (
                  <TouchableOpacity
                    style={styles.addImageButton}
                    onPress={handleAddImages}
                  >
                    <Add size={screenRem * 3} color={THEME} />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <Dropzone label={`Add images`} onPress={handleAddImages} />
            )}
          </View>

          <VerticalSpace h={2} />

          <SolidButton label={`Add Review`} onPress={handleAddReview} />
        </View>
      </KeyboardAwareScrollView>
    </ModalWrapper>
  );
};

export default AddReviewModal;

const styles = StyleSheet.create({
  container: { paddingHorizontal: widthRem * 4 },
  labelText: { fontFamily: BERTIOGASANS_MEDIUM, fontSize: screenRem * 1.2 },
  imagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  imageContainer: {
    marginRight: widthRem * 4,
    marginBottom: heightRem * 2,
  },
  image: {
    height: screenRem * 6,
    width: screenRem * 6,
    borderRadius: screenRem,
  },
  removeImageButton: {
    position: "absolute",
    right: -screenRem,
    top: -heightRem,
  },
  addImageButton: {
    height: screenRem * 6,
    width: screenRem * 6,
    borderRadius: screenRem,
    borderWidth: 1,
    borderColor: THEME,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
});
