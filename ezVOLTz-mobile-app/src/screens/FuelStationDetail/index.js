import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Arrow, Call, Heart, MessageQuestion } from "iconsax-react-native";
import { isEmpty, isNull } from "lodash";
import { useSelector } from "react-redux";
import useState from "react-usestateref";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ImageView from "react-native-image-viewing";

import PrimaryHeader from "../../components/Headers/PrimaryHeader";
import Line from "../../components/Line";
import VerticalSpace from "../../components/VerticalSpace";
import HorizontalSpace from "../../components/HorizontalSpace";
import AddReviewModal from "../../components/Modals/Review/AddReviewModal";
import Loader from "../../components/Loader";
import TextButton from "../../components/Buttons/TextButton";
import ReplyTextInput from "../../components/TextInputs/ReplyTextInput";
import DecisionModal from "../../components/Modals/DecisionModal";

import {
  BLACK,
  FLINT_STONE,
  JASPER_CANE,
  THEME,
  WHITE,
  WHITE_SMOKE,
} from "../../constants/colors";
import {
  heightRem,
  screenRem,
  width,
  widthRem,
} from "../../constants/dimensions";
import images from "../../constants/images";
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from "../../constants/fonts";
import {
  chargingStationStatus,
  chargingStationColor,
} from "../../constants/enum";
import useLocationServices from "../../hooks/useLocationServices";
import useDisplayModal from "../../hooks/useDisplayModal";
import useFetchApi from "../../hooks/useFetchApi";
import {
  showSnackDanger,
  showSnackSuccess,
  timeAgo,
} from "../../utils/functions";
import { STAR } from "../../assets/icons";
import useApiHook from "../../hooks/rest/useApi";
import FastImage from "react-native-fast-image";

const FuelStationDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { location, requestUserCurrentLocation } = useLocationServices();
  const [addReviewModal, toggleAddReviewModal] = useDisplayModal(false);
  const [guestModal, toggleGuestModal] = useDisplayModal(false);
  const [reviewImageView, toggleReviewImageView] = useDisplayModal(false);
  const { fetchApiCall, fetchApiLoading } = useFetchApi();
  const { auth } = useSelector((state) => state);
  const { handleRestApi } = useApiHook();
  const isFocused = useIsFocused();

  const USERID = auth.user._id;
  const STATION = route.params.stationData;
  let ISGUEST;

  ISGUEST = isEmpty(auth.user);
  ISGUEST = isNull(auth.refreshToken);

  const [reviews, setReviews] = useState({});
  const [replies, setReplies] = useState({});
  const [_, setReplyTo, replyToRef] = useState(``);
  const [__, setRepliesTo, repliesToRef] = useState(``);
  const [___, setPreviewImages, previewImagesRef] = useState([]);
  const [____, setIndexToPreview, indexToPreviewRef] = useState(0);
  const [replyText, setReplyText] = useState(``);
  const [replySubmit, setReplySubmit] = useState(false);

  const reviewsAverage = reviews.reviewsAverage;

  useEffect(() => {
    if (!isEmpty(location)) {
      goToGetDirection(location);
    }
  }, [location]);

  useFocusEffect(
    useCallback(() => {
      getAllReviews();
    }, []),
  );

  const onMakePhoneCall = async () => {
    Linking.openURL(`tel:${STATION.station_phone}`);
  };

  //review
  const addReview = async (data) => {
    toggleAddReviewModal();

    let formData = new FormData();

    formData.append("userId", USERID);
    formData.append("rating", data.rating);
    formData.append("comment", data.comment);
    formData.append("stationId", STATION.id);
    formData.append("stationType", `nrel`);

    if (data.images.length > 0) {
      for (var i = 0; i < data.images.length; i++) {
        formData.append("images", {
          uri: data.images[i].uri,
          type: data.images[i].type,
          name: data.images[i].fileName,
        });
      }
    }

    const response = await fetchApiCall(
      `review`,
      `post`,
      {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${auth.accessToken}`,
      },
      formData,
    );

    if (response.status === 201) {
      getAllReviews();
      showSnackSuccess(`Your review has been submitted`);
    }
  };

  const getAllReviews = async () => {
    const response = await handleRestApi({
      method: `get`,
      url: `review/all/${STATION.id}/nrel`,
    });

    setReviews(response.data);
  };

  const handleReviewLikeDislike = async (data, review) => {
    setReviews({
      ...reviews,
      reviews: reviews?.reviews?.map((isReview) => {
        if (isReview._id === data.reviewId) {
          const updatedLikes = data.like
            ? [
                ...review.like.filter((like) => like !== data.userId),
                data.userId,
              ]
            : review.like.filter((like) => like !== data.userId);

          return {
            ...isReview,
            like: updatedLikes,
          };
        }
        return isReview;
      }),
    });

    await handleRestApi({
      method: `post`,
      url: `review/like-dislike`,
      data,
    });
  };

  const handleReviewReply = async (review) => {
    const data = {
      comment: replyText,
      reviewId: review._id,
      userId: USERID,
    };

    const response = await handleRestApi({
      method: `post`,
      url: `reviews/reply`,
      data,
    });

    if (response.status === 201) {
      setReplySubmit(false);
      setReplyTo(``);
      getAllReplies(review._id);
    }
  };

  const getAllReplies = async (reviewId) => {
    setRepliesTo(reviewId);
    setReplies({});

    const response = await handleRestApi({
      method: "get",
      url: `reviews/reply/all/${reviewId}`,
    });

    if (response.status === 200) {
      setReplies(response.data);
    }
  };

  const handlePreviewReviewImage = (imagesArray, imgIndex) => {
    let images = [];
    imagesArray.forEach((string, index) => {
      var obj = { uri: string, index: index };
      images.push(obj);
    });

    setPreviewImages(images);
    setIndexToPreview(imgIndex);
    toggleReviewImageView();
  };
  //

  const goToGetDirection = useCallback(
    (location) => {
      navigation.navigate(`GetDirection`, {
        locationUser: location,
        locationFuelStation: {
          latitude: STATION.latitude,
          longitude: STATION.longitude,
        },
      });
    },
    [navigation],
  );

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const goToAccessAccount = useCallback(() => {
    navigation.navigate("AccessAccount");
  }, [navigation]);

  const CustomIconButton = ({
    iconComponent,
    iconColor,
    backgroundColor,
    label,
    onPress,
  }) => (
    <Pressable style={styles.customButtonContainer} onPress={onPress}>
      <View style={styles.customButtonIconContainer(backgroundColor)}>
        {React.cloneElement(iconComponent, {
          size: screenRem * 1.6,
          color: iconColor,
        })}
      </View>

      <VerticalSpace h={1} />

      <Text style={styles.customButtonLabelText}>{label}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      {fetchApiLoading ? <Loader /> : null}

      <DecisionModal
        isVisible={guestModal}
        label={`Create an Account or Login`}
        message={`Welcome to ezVOLTz. Would you like to create an account or log in to access additional features and personalize your experience?`}
        leftButtonText={`No`}
        rightButtonText={`Yes`}
        leftButtonPress={toggleGuestModal}
        rightButtonPress={() => {
          toggleGuestModal();
          goToAccessAccount();
        }}
        displayCloseButton={false}
      />

      {!isEmpty(previewImagesRef.current) && (
        <ImageView
          images={previewImagesRef.current}
          imageIndex={indexToPreviewRef.current}
          visible={reviewImageView}
          onRequestClose={toggleReviewImageView}
        />
      )}

      <PrimaryHeader
        label={STATION.station_name}
        color={BLACK}
        displayBackButton={true}
        onBackButtonPress={goBack}
      />

      {addReviewModal && (
        <AddReviewModal
          isVisible={addReviewModal}
          closeModal={toggleAddReviewModal}
          label={`Add Review`}
          displayCloseButton={true}
          onSubmitReview={addReview}
        />
      )}

      <View style={styles.container}>
        <KeyboardAwareScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <FastImage
            source={images.fuelStation}
            style={styles.fuelStationImage}
            resizeMode={"stretch"}
          />

          <View style={styles.detailContainer}>
            <View style={styles.nameAddressContainer}>
              <Text style={styles.stationName}>{STATION.station_name}</Text>

              <VerticalSpace h={1} />

              <Text style={styles.stationAddress}>
                {STATION.street_address}, {STATION.city}, {STATION.state},{" "}
                {STATION.state}, {STATION.country}
              </Text>
            </View>

            <Line />

            <View style={styles.buttonsContainer}>
              <CustomIconButton
                iconComponent={<Call />}
                iconColor={BLACK}
                backgroundColor={WHITE_SMOKE}
                label={`Make${`\n`}Call`}
                onPress={onMakePhoneCall}
              />

              <CustomIconButton
                iconComponent={<MessageQuestion />}
                iconColor={BLACK}
                backgroundColor={WHITE_SMOKE}
                label={`Add${`\n`}Review`}
                onPress={!ISGUEST ? toggleAddReviewModal : toggleGuestModal}
              />

              <CustomIconButton
                iconComponent={<Arrow />}
                iconColor={WHITE}
                backgroundColor={THEME}
                label={`Get${`\n`}Direction`}
                onPress={requestUserCurrentLocation}
              />
            </View>

            <Line />

            <View style={styles.verticalSpace}>
              <View style={styles.stationDetailItemContainer}>
                <View style={styles.halfWidth}>
                  <Text style={styles.stationDetailHeading}>
                    Connector Type
                  </Text>

                  <VerticalSpace h={1} />

                  <Text style={styles.stationDetailValue}>
                    {STATION.ev_level1_evse_num
                      ? "Level 1"
                      : STATION.ev_dc_fast_num
                      ? "Fast Charger"
                      : STATION.ev_level2_evse_num
                      ? "Level 2"
                      : "N/A"}
                  </Text>
                </View>

                <View style={styles.halfWidth}>
                  <Text style={styles.stationDetailHeading}>Access</Text>

                  <VerticalSpace h={1} />

                  <Text style={styles.stationDetailValue}>
                    {STATION.access_code}
                  </Text>
                </View>
              </View>

              <VerticalSpace h={2} />

              <View style={styles.stationDetailItemContainer}>
                <View style={styles.halfWidth}>
                  <Text style={styles.stationDetailHeading}>Type</Text>

                  <VerticalSpace h={1} />

                  <Text style={styles.stationDetailValue}>
                    {STATION.ev_level1_evse_num
                      ? "Level 1"
                      : STATION.ev_dc_fast_num
                      ? "Fast Charger"
                      : STATION.ev_level2_evse_num
                      ? "Level 2"
                      : "N/A"}
                  </Text>
                </View>

                <View style={styles.halfWidth}>
                  <Text style={styles.stationDetailHeading}>
                    Charging Network
                  </Text>

                  <VerticalSpace h={1} />

                  <Text style={styles.stationDetailValue}>
                    {STATION.ev_network || `N/A`}
                  </Text>
                </View>
              </View>

              <VerticalSpace h={2} />

              <View style={styles.stationDetailItemContainer}>
                <View>
                  <Text style={styles.stationDetailHeading}>Status</Text>

                  <VerticalSpace h={1} />

                  <Text
                    style={{
                      ...styles.stationDetailValue,
                      color: chargingStationColor[STATION.status_code],
                    }}
                  >
                    {chargingStationStatus[STATION.status_code]}
                  </Text>
                </View>
              </View>
            </View>

            <Line />

            {/* review */}
            {!isEmpty(reviews) && (
              <View style={styles.verticalSpace}>
                <View style={styles.sectionHeadingContainer}>
                  <Text style={styles.sectionHeadingText}>
                    Reviews & Rating
                  </Text>

                  <View style={styles.ratingContainer}>
                    <STAR height={screenRem * 1.6} width={screenRem * 1.6} />

                    <HorizontalSpace w={2} />

                    <Text style={styles.sectionHeadingText}>
                      {isEmpty(reviewsAverage) ? 0 : reviewsAverage.average} (
                      {isEmpty(reviewsAverage) ? 0 : reviewsAverage.count})
                    </Text>
                  </View>
                </View>

                <VerticalSpace h={2} />

                <FlatList
                  data={reviews.reviews}
                  renderItem={({ item }) => (
                    <View style={styles.reviewContainer}>
                      <View style={styles.reviewProfileImageContainer}>
                        <FastImage
                          style={styles.userProfileImage}
                          source={{
                            uri: item.user.profileImage,
                          }}
                        />
                      </View>
                      <View style={styles.reviewInfoContainer}>
                        <View style={styles.reviewTopContainer}>
                          <View style={styles.reviewByAndWhenContainer}>
                            <Text style={styles.reviewByText}>
                              {item.user.name}
                            </Text>

                            <HorizontalSpace w={1} />

                            <Text>•</Text>

                            <HorizontalSpace w={1} />

                            <Text style={styles.reviewWhenText}>
                              {timeAgo(new Date(item.createdAt))}
                            </Text>
                          </View>

                          <View style={styles.ratingStarsContainer}>
                            {[...Array(Math.ceil(item.rating))].map(
                              (_, rInd) => (
                                <View key={rInd}>
                                  <STAR />
                                </View>
                              ),
                            )}
                          </View>
                        </View>

                        <VerticalSpace h={2} />

                        <Text style={styles.reviewText}>{item.comment}</Text>

                        {!isEmpty(item.images) && (
                          <>
                            <VerticalSpace h={2} />

                            <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}
                            >
                              <View style={styles.reviewImagesContainer}>
                                {item.images.map((img, imgIndex) => (
                                  <TouchableOpacity
                                    key={imgIndex}
                                    onPress={() =>
                                      handlePreviewReviewImage(
                                        item.images,
                                        imgIndex,
                                      )
                                    }
                                  >
                                    <FastImage
                                      style={styles.reviewImage}
                                      source={{ uri: img }}
                                    />
                                  </TouchableOpacity>
                                ))}
                              </View>
                            </ScrollView>
                          </>
                        )}

                        {!ISGUEST && (
                          <View>
                            <VerticalSpace h={2} />

                            <View
                              style={{
                                ...styles.reviewBottomContainer,
                                justifyContent:
                                  item._id === replyToRef.current
                                    ? "flex-end"
                                    : "space-between",
                              }}
                            >
                              {item._id !== replyToRef.current && (
                                <TextButton
                                  label={`Reply`}
                                  customTextStyle={{ color: THEME }}
                                  onPress={() => {
                                    setReplyText(``);
                                    setReplyTo(item._id);
                                  }}
                                />
                              )}

                              <View style={styles.reviewLikeContainer}>
                                <Text>{item.like.length}</Text>
                                <HorizontalSpace w={2} />
                                <TouchableOpacity
                                  onPress={() =>
                                    handleReviewLikeDislike(
                                      {
                                        like: !item.like.includes(USERID),
                                        dislike: false,
                                        reviewId: item._id,
                                        userId: USERID,
                                      },
                                      item,
                                    )
                                  }
                                >
                                  <Heart
                                    color={THEME}
                                    size={screenRem * 2}
                                    variant={
                                      item.like.includes(USERID)
                                        ? `Bold`
                                        : `Linear`
                                    }
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        )}

                        <VerticalSpace h={2} />

                        {item._id === replyToRef.current && (
                          <>
                            <ReplyTextInput
                              placeholder={`Write reply`}
                              onReplySubmit={() => {
                                if (replyText === ``) {
                                  showSnackDanger(`Reply cannot be empty`);
                                } else {
                                  handleReviewReply(item);
                                  setReplySubmit(true);
                                }
                              }}
                              value={replyText}
                              onChangeText={(val) => setReplyText(val)}
                              replySubmit={replySubmit}
                            />
                            <VerticalSpace h={2} />
                          </>
                        )}

                        {!isEmpty(item.reply) &&
                          item._id !== repliesToRef.current && (
                            <>
                              <VerticalSpace h={2} />

                              <TextButton
                                label={`Show replies`}
                                customTextStyle={{ color: THEME }}
                                onPress={() => {
                                  getAllReplies(item._id);
                                }}
                              />
                            </>
                          )}

                        {!isEmpty(replies) &&
                          item._id === repliesToRef.current &&
                          replies.replies.map((reply, replyIndex) => (
                            <View key={replyIndex}>
                              <VerticalSpace h={2} />
                              <View style={styles.replyContainer}>
                                <View style={styles.replyProfileImageContainer}>
                                  <FastImage
                                    style={styles.replyProfileImage}
                                    source={{
                                      uri: reply.user.profileImage,
                                    }}
                                  />
                                </View>

                                <View style={styles.replyTextContainer}>
                                  <Text style={styles.replyText}>
                                    {reply.comment}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          ))}
                      </View>
                    </View>
                  )}
                  keyExtractor={(item) => item._id}
                />
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FuelStationDetail;

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  container: { flex: 1 },
  fuelStationImage: {
    height: heightRem * 28,
    width,
  },
  detailContainer: {
    paddingHorizontal: widthRem * 4,
  },
  nameAddressContainer: { paddingVertical: heightRem * 2 },
  stationName: {
    fontSize: screenRem * 1.3,
    fontFamily: BERTIOGASANS_MEDIUM,
  },
  stationAddress: {
    fontSize: screenRem * 1.1,
    fontFamily: BERTIOGASANS_REGULAR,
    color: FLINT_STONE,
  },
  buttonsContainer: {
    paddingVertical: heightRem * 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  customButtonContainer: { alignItems: "center", justifyContent: "center" },
  customButtonIconContainer: (backgroundColor) => ({
    height: screenRem * 4,
    width: screenRem * 4,
    backgroundColor,
    borderRadius: screenRem * 2,
    borderWidth: 1,
    borderColor: backgroundColor === THEME ? THEME : JASPER_CANE,
    alignItems: "center",
    justifyContent: "center",
  }),
  customButtonLabelText: {
    textAlign: "center",
    fontSize: screenRem,
    color: FLINT_STONE,
    fontFamily: BERTIOGASANS_REGULAR,
  },
  stationDetailHeading: {
    color: FLINT_STONE,
    fontSize: screenRem * 1.1,
    fontFamily: BERTIOGASANS_REGULAR,
  },
  stationDetailValue: {
    fontSize: screenRem * 1.3,
    textTransform: "capitalize",
    fontFamily: BERTIOGASANS_MEDIUM,
  },
  stationDetailItemContainer: { flexDirection: "row", alignItems: "center" },
  halfWidth: { width: "50%" },
  verticalSpace: { paddingVertical: heightRem * 2 },

  //review
  sectionHeadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionHeadingText: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.3,
  },
  ratingContainer: { flexDirection: "row", alignItems: "center" },
  reviewContainer: {
    flexDirection: "row",
    marginVertical: heightRem * 2,
  },
  reviewProfileImageContainer: {
    width: `22%`,
  },
  reviewInfoContainer: {
    width: `78%`,
  },
  userProfileImage: {
    height: screenRem * 4,
    width: screenRem * 4,
    borderRadius: screenRem * 2,
  },
  reviewTopContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reviewByAndWhenContainer: { flexDirection: "row", alignItems: "center" },
  reviewByText: {
    fontFamily: BERTIOGASANS_MEDIUM,
    fontSize: screenRem * 1.2,
  },
  reviewWhenText: {
    fontFamily: BERTIOGASANS_REGULAR,
    color: FLINT_STONE,
    fontSize: screenRem,
  },
  reviewText: {
    color: FLINT_STONE,
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.2,
    lineHeight: screenRem * 1.6,
  },
  reviewImagesContainer: { flexDirection: "row" },
  reviewImage: {
    height: screenRem * 6,
    width: screenRem * 6,
    marginRight: widthRem * 2,
    borderRadius: screenRem * 0.4,
    marginBottom: heightRem,
  },
  ratingStarsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewBottomContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewLikeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  replyContainer: {
    flexDirection: "row",
  },
  replyProfileImageContainer: { width: "18%" },
  replyProfileImage: {
    height: screenRem * 3,
    width: screenRem * 3,
    borderRadius: screenRem * 1.5,
  },
  replyTextContainer: { width: "82%" },
  replyText: {
    fontFamily: BERTIOGASANS_REGULAR,
    color: FLINT_STONE,
    fontSize: screenRem,
    lineHeight: screenRem * 1.4,
  },
});
