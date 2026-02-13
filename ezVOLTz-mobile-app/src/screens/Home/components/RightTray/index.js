import React from 'react';
import {Gps, InfoCircle, Radar2, Location} from 'iconsax-react-native';
import {View, Pressable, StyleSheet} from 'react-native';

import VerticalSpace from '../../../../components/VerticalSpace';

import {BLACK, THEME, WHITE, BERN_RED} from '../../../../constants/colors';
import {LIST} from '../../../../assets/icons';
import {
  heightRem,
  screenRem,
  width,
  widthRem,
} from '../../../../constants/dimensions';

const RightTray = ({
  listView,
  onCurrentLocationPress,
  onMapLegendPress,
  onRadiusSelectionPress,
  onListViewPress,
}) => {
  return (
    <View style={styles.container}>
      {!listView && (
        <>
          <Pressable
            style={styles.secondaryButton}
            onPress={onCurrentLocationPress}>
            <Gps size={screenRem * 1.4} color={BERN_RED} />
          </Pressable>

          <VerticalSpace h={1} />

          <Pressable style={styles.secondaryButton} onPress={onMapLegendPress}>
            <InfoCircle size={screenRem * 1.4} color={BLACK} />
          </Pressable>

          <VerticalSpace h={1} />

          <Pressable
            style={styles.secondaryButton}
            onPress={onRadiusSelectionPress}>
            <Radar2 size={screenRem * 1.4} color={BLACK} />
          </Pressable>

          <VerticalSpace h={1} />
        </>
      )}

      <Pressable style={styles.primaryButton} onPress={onListViewPress}>
        {!listView ? (
          <LIST height={screenRem * 1.2} width={screenRem * 1.2} />
        ) : (
          <Location size={screenRem * 1.4} color={WHITE} />
        )}
      </Pressable>
    </View>
  );
};

export default RightTray;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
    bottom: heightRem * 2,
    right: widthRem * 3,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: WHITE,
    height: screenRem * 3.4,
    width: screenRem * 3.4,
    borderRadius: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: THEME,
    height: screenRem * 4,
    width: screenRem * 4,
    borderRadius: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
