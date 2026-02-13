import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import {
  Keyboard,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { Field, Formik } from "formik";
import { isEmpty, isNull } from "lodash";
import NetworkLogger from "react-native-network-logger";
import { launchImageLibrary } from "react-native-image-picker";
import { GalleryAdd, Minus } from "iconsax-react-native";

import VerticalSpace from "../../components/VerticalSpace";
import PrimaryHeader from "../../components/Headers/PrimaryHeader";
import OutlineTextInput from "../../components/TextInputs/OutlineTextInput";
import TextArea from "../../components/TextArea";
import SolidButton from "../../components/Buttons/SolidButton";
import Loader from "../../components/Loader";
import Dropzone from "../../components/Dropzone";
import ProgressiveImage from "../../components/ProgressiveImage";

import {
  BERN_RED,
  BLACK,
  THEME,
  WHITE,
  WHITE_SMOKE,
} from "../../constants/colors";
import { heightRem, screenRem, widthRem } from "../../constants/dimensions";
import { verifiedUserSchema, guestUserSchema } from "../../utils/schema";
import { BERTIOGASANS_REGULAR } from "../../constants/fonts";
import { showSnackDanger, showSnackSuccess } from "../../utils/functions";
import { multiImageOptions } from "../../constants/miscellaneous";
import useFetchApi from "../../hooks/useFetchApi";

const Feedback = () => {
  const navigation = useNavigation();
  const formikRef = useRef();
  const { auth } = useSelector((state) => state);
  const { fetchApiCall, fetchApiLoading } = useFetchApi();

  let ISGUEST;

  ISGUEST = isEmpty(auth.user);
  ISGUEST = isNull(auth.refreshToken);

  const [images, setImages] = useState([]);
  const [feedbackValues] = useState(
    ISGUEST
      ? {
        name: ``,
        email: ``,
        subject: ``,
        description: ``,
      }
      : {
        subject: ``,
        description: ``,
      }
  );

  const handleUploadImages = async () => {
    Keyboard.dismiss();

    launchImageLibrary(
      multiImageOptions,
      ({ didCancel, errorCode, assets }) => {
        if (didCancel) {
        } else if (errorCode) {
          showSnackDanger(
            "There is an issue with this image. Please select another one"
          );
        } else if (assets[0]?.height === 0 || assets[0]?.width === 0) {
          showSnackDanger(
            "There is an issue with this image. Please select another one"
          );
        } else {
          const sum = images.length + assets.length;
          if (sum > 5) {
            showSnackDanger("Only 5 images can be uploaded");
          } else {
            const combinedImages = [...images, ...assets];

            const filteredImages = Array.from(
              new Set(combinedImages.map(({ fileSize }) => fileSize))
            ).map((fileSize) =>
              combinedImages.find((b) => b.fileSize === fileSize)
            );

            setImages(filteredImages);
          }
        }
      }
    );
  };

  const handleRemoveUploadImage = (index) => {
    const updatedItems = images.filter((_, idx) => idx !== index);
    setImages(updatedItems);
  };

  const feedback = async () => {
    Keyboard.dismiss();

    const { description, email, name, subject } = formikRef.current?.values;

    let formData = new FormData();

    formData.append("title", subject);
    formData.append("description", description);

    if (!ISGUEST) {
      formData.append("user[email]", auth.user.email);
      formData.append("user[name]", auth.user.name);
    } else {
      formData.append("user[email]", email);
      formData.append("user[name]", name);
    }

    if (images.length > 0) {
      for (let i = 0; i < images?.length; i++) {
        formData.append("images", {
          uri: images[i].uri,
          type: images[i].type,
          name: images[i].fileName,
        });
      }
    }

    const response = await fetchApiCall(
      `feedback`,
      `post`,
      {
        "Content-Type": "multipart/form-data",
      },
      formData
    );

    if (response.status === 201) {
      showSnackSuccess(response.data.message);

      const timer = setTimeout(() => {
        goBack();
        formikRef.current?.resetForm();
        setImages([]);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  };

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {fetchApiLoading && <Loader />}

      <PrimaryHeader
        label={`Feedback`}
        color={BLACK}
        displayBackButton={true}
        onBackButtonPress={goBack}
      />

      <View style={styles.formContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Formik
            innerRef={formikRef}
            validateOnChange={true}
            validateOnBlur={true}
            onSubmit={feedback}
            initialValues={feedbackValues}
            validationSchema={ISGUEST ? guestUserSchema : verifiedUserSchema}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => {
              return (
                <>
                  <VerticalSpace h={4} />

                  {ISGUEST && (
                    <>
                      <Field name={`name`}>
                        {({ meta }) => (
                          <>
                            <OutlineTextInput
                              placeholder={`Name`}
                              onChangeText={handleChange("name")}
                              onBlur={handleBlur("name")}
                              value={values.name}
                            />

                            <VerticalSpace h={1} />

                            <Text style={styles.errorMessage}>
                              {meta.touched ? meta.error : null}
                            </Text>
                          </>
                        )}
                      </Field>

                      <VerticalSpace h={1} />

                      <Field name={`email`}>
                        {({ meta }) => (
                          <>
                            <OutlineTextInput
                              placeholder={`Email`}
                              onChangeText={handleChange("email")}
                              onBlur={handleBlur("email")}
                              value={values.email}
                            />

                            <VerticalSpace h={1} />

                            <Text style={styles.errorMessage}>
                              {meta.touched ? meta.error : null}
                            </Text>
                          </>
                        )}
                      </Field>

                      <VerticalSpace h={1} />
                    </>
                  )}

                  <Field name={`subject`}>
                    {({ meta }) => (
                      <>
                        <OutlineTextInput
                          placeholder={`Subject`}
                          onChangeText={handleChange("subject")}
                          onBlur={handleBlur("subject")}
                          value={values.subject}
                        />

                        <VerticalSpace h={1} />

                        <Text style={styles.errorMessage}>
                          {meta.touched ? meta.error : null}
                        </Text>
                      </>
                    )}
                  </Field>

                  <VerticalSpace h={1} />

                  <Field name={`description`}>
                    {({ meta }) => (
                      <>
                        <TextArea
                          placeholder={`Message`}
                          onChangeText={handleChange("description")}
                          onBlur={handleBlur("description")}
                          value={values.description}
                        />

                        <VerticalSpace h={1} />

                        <Text style={styles.errorMessage}>
                          {meta.touched ? meta.error : null}
                        </Text>
                      </>
                    )}
                  </Field>

                  <VerticalSpace h={2} />

                  {isEmpty(images) ? (
                    <Dropzone
                      label={`Upload Images (Optional)`}
                      onPress={handleUploadImages}
                    />
                  ) : (
                    <View style={styles.feedbackImagesContainer}>
                      {images.map((item, index) => {
                        return (
                          <View style={styles.imageContainer} key={index}>
                            <Pressable
                              style={styles.removeImageButton}
                              onPress={() => handleRemoveUploadImage(index)}
                            >
                              <Minus size={screenRem * 1.6} color={WHITE} />
                            </Pressable>

                            <ProgressiveImage
                              source={{ uri: item.uri }}
                              style={styles.image}
                            />
                          </View>
                        );
                      })}

                      <Pressable
                        style={styles.addMoreFeedbackImagesButton}
                        onPress={handleUploadImages}
                      >
                        <GalleryAdd size={screenRem * 3} color={THEME} />
                      </Pressable>
                    </View>
                  )}

                  <VerticalSpace h={2} />

                  <SolidButton
                    label={`Submit`}
                    size={`xl`}
                    onPress={handleSubmit}
                  />

                  {/* <NetworkLogger /> */}
                </>
              );
            }}
          </Formik>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: widthRem * 4,
  },
  errorMessage: {
    color: BERN_RED,
    fontSize: screenRem,
    fontFamily: BERTIOGASANS_REGULAR,
    marginLeft: widthRem * 6,
  },
  feedbackImagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: widthRem * 4,
  },
  imageContainer: { marginRight: widthRem * 4, marginBottom: heightRem },
  removeImageButton: {
    position: "absolute",
    zIndex: 1,
    right: -screenRem * 0.2,
    top: -screenRem * 0.5,
    backgroundColor: BERN_RED,
    borderRadius: 200,
  },
  image: {
    height: screenRem * 6,
    width: screenRem * 6,
    borderRadius: screenRem,
  },
  addMoreFeedbackImagesButton: {
    height: screenRem * 6,
    width: screenRem * 6,
    borderRadius: screenRem,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WHITE_SMOKE,
    borderWidth: 1,
    borderColor: THEME,
    borderStyle: "dashed",
  },
});
