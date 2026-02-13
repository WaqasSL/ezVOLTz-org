import { CloseCircle } from "iconsax-react-native";
import React from "react";
import { Image, Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isUndefined } from "lodash";

import { WHITE } from "../../../constants/colors";
import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";

const AdBannerSecondary = ({
    onAdClose
}) => {
    const { ads } = useSelector((state) => state);
    const insets = useSafeAreaInsets();

    const image = ads?.activeAd?.images[2]?.src;
    const link = ads?.activeAd?.link;

    return (
        <TouchableOpacity style={styles.adContainer(insets)} onPress={() => Linking.openURL(link)}>
            <TouchableOpacity onPress={onAdClose} style={styles.closeButton}>
                <CloseCircle
                    size={screenRem * 1.6}
                    color={WHITE}
                    variant={`Bold`}
                />
            </TouchableOpacity>

            <View style={styles.imageContainer}>
                <FastImage
                    source={{ uri: image }}
                    style={styles.adImage}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>
        </TouchableOpacity>
    );
};

export default AdBannerSecondary;

const styles = StyleSheet.create({
    adContainer: (insets) => ({ height: heightRem * 8, width: widthRem * 92, position: 'absolute', zIndex: 1, top: insets.top + heightRem * 10, alignSelf: 'center' }),
    closeButton: { position: "absolute", zIndex: 1, right: widthRem, borderRadius: 100, backgroundColor: 'black', top: heightRem / 2 },
    imageContainer: { flex: 1 },
    adImage: { height: '72%', width: '100%', position: 'absolute', top: 0, left: 0 }
})