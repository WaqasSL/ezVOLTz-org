import { CloseCircle } from "iconsax-react-native";
import React from "react";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";

import { WHITE } from "../../../constants/colors";
import { heightRem, screenRem, widthRem } from "../../../constants/dimensions";

const AdBannerPrimary = ({ onAdClose }) => {
    const { ads } = useSelector((state) => state);

    const image = ads.activeAd.images[0].src;
    const link = ads.activeAd.link;

    return (
        <TouchableOpacity onPress={() => Linking.openURL(link)} style={styles.adContainer}>
            <TouchableOpacity onPress={onAdClose} style={styles.closeButton}>
                <CloseCircle
                    size={screenRem * 2}
                    color={WHITE}
                    variant={`Bold`}
                />
            </TouchableOpacity>

            <View style={styles.adImage}>
                <FastImage
                    source={{ uri: image }}
                    style={styles.adImage}
                    resizeMode={FastImage.resizeMode.stretch}
                />
            </View>
        </TouchableOpacity>
    );
};

export default AdBannerPrimary;

const styles = StyleSheet.create({
    adContainer: { height: heightRem * 16, width: widthRem * 92 },
    closeButton: { position: "absolute", zIndex: 1, right: widthRem, top: heightRem, borderRadius: 100, backgroundColor: 'black' },
    adImage: { flex: 1 }
})