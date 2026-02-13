import React from 'react';
import {Text, View, StyleSheet, Pressable} from 'react-native';
import {Clock, Location, MinusCirlce} from 'iconsax-react-native';
// import Dash from "react-native-dash";
import {isEmpty, isNull} from 'lodash';
import moment from 'moment';

import VerticalSpace from '../../../components/VerticalSpace';
import HorizontalSpace from '../../../components/HorizontalSpace';

import {
  BERN_RED,
  BLACK,
  FLINT_STONE,
  JASPER_CANE,
  PINBALL,
  THEME,
  WHITE,
  WILD_DOVE,
} from '../../../constants/colors';
import {heightRem, screenRem, widthRem} from '../../../constants/dimensions';
import {
  BERTIOGASANS_MEDIUM,
  BERTIOGASANS_REGULAR,
} from '../../../constants/fonts';
import {DIR_RIGHT_BLACK} from '../../../assets/icons';
import {
  pastTripsStatusIcon,
  pastTripsStatusText,
  pastTripBadgeColor,
  tripStatus,
} from '../../../constants/enum';

const PastTripCard = ({data, onCardPress}) => {
  const stops = data?.stops;

  return (
    <Pressable style={styles.container} onPress={onCardPress}>
      <View style={styles.topContainer}>
        <View
          style={{
            ...styles.statusContainer,
            backgroundColor: pastTripBadgeColor[data?.status] || WILD_DOVE,
          }}>
          {pastTripsStatusIcon[data?.status] || (
            <MinusCirlce size={screenRem * 1.2} color={WHITE} />
          )}

          <HorizontalSpace w={2} />

          <Text style={styles.statusText}>
            {pastTripsStatusText[data?.status] || 'Not Started'}
          </Text>
        </View>
      </View>

      <VerticalSpace h={1} />

      <View>
        <View style={styles.infoContainer}>
          <View style={styles.infoLeftContainer}>
            <View style={styles.originIcon} />
          </View>

          <Text style={{...styles.infoText, width: '92%'}} numberOfLines={1}>
            {data?.origin?.text}
          </Text>
        </View>

        <VerticalSpace h={0.1} />

        <View style={styles.infoContainer}>
          <View style={styles.infoLeftContainer}>
            {/* <Dash
              style={styles.dottedLine}
              dashColor={PINBALL}
              dashLength={4}
              dashThickness={2}
              dashGap={2}
            /> */}
          </View>
        </View>

        {!isEmpty(stops) && (
          <>
            <VerticalSpace h={0.1} />

            <View style={styles.infoContainer}>
              <View style={styles.infoLeftContainer}>
                <View style={styles.stopsIcon} />
              </View>

              <Text style={styles.infoText}>
                {stops?.length} {stops?.length == 1 ? `Stop` : `Stops`}
              </Text>
            </View>

            <VerticalSpace h={0.1} />

            <View style={styles.infoContainer}>
              <View style={styles.infoLeftContainer}>
                {/* <Dash
                  style={styles.dottedLine}
                  dashColor={PINBALL}
                  dashLength={4}
                  dashThickness={2}
                  dashGap={2}
                /> */}
              </View>
            </View>
          </>
        )}

        <VerticalSpace h={0.1} />

        <View style={styles.infoContainer}>
          <View style={styles.infoLeftContainer}>
            <Location size={screenRem * 1.6} color={BERN_RED} />
          </View>

          <Text style={{...styles.infoText, width: '92%'}} numberOfLines={1}>
            {data?.destination?.text}
          </Text>
        </View>
      </View>

      <VerticalSpace h={1} />

      <View style={styles.bottomContainer}>
        <View style={styles.bottomChildContainer}>
          <DIR_RIGHT_BLACK />

          <HorizontalSpace w={2} />

          <Text style={styles.infoText}>
            {data?.distance?.replace(/m/, 'M')}
          </Text>
        </View>

        <View style={styles.bottomChildContainer}>
          <Clock size={screenRem * 1.6} color={BLACK} />

          <HorizontalSpace w={2} />

          <Text style={styles.infoText}>
            {data.status !== tripStatus.isCompleted &&
            data.status !== tripStatus.inProgress
              ? moment(data?.startDate).format('MMM DD, YYYY hh:mm A')
              : moment(data?.actualStartDateTime).format(
                  'MMM DD, YYYY hh:mm A',
                )}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default PastTripCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: widthRem * 6,
    paddingVertical: heightRem * 2,
    backgroundColor: WHITE,
    borderColor: JASPER_CANE,
    borderWidth: 1,
    borderRadius: screenRem * 2,
    marginHorizontal: widthRem * 4,
    marginVertical: heightRem,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: widthRem * 2,
    paddingVertical: heightRem * 0.6,
    borderRadius: screenRem * 0.6,
  },
  statusText: {
    color: WHITE,
    fontSize: screenRem * 0.9,
    fontFamily: BERTIOGASANS_MEDIUM,
  },
  startTripContainer: {
    height: screenRem * 3,
    width: screenRem * 3,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: THEME,
    borderRadius: screenRem * 2,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLeftContainer: {
    width: widthRem * 8,
    alignItems: 'center',
  },
  originIcon: {
    height: screenRem,
    width: screenRem,
    borderRadius: screenRem,
    borderWidth: 1,
    borderColor: BLACK,
  },
  infoText: {
    fontFamily: BERTIOGASANS_REGULAR,
    color: FLINT_STONE,
    fontSize: screenRem * 1.1,
  },
  dottedLine: {
    height: heightRem * 1.8,
    flexDirection: 'column',
  },
  stopsIcon: {
    height: screenRem * 0.8,
    width: screenRem * 0.8,
    borderRadius: screenRem,
    backgroundColor: JASPER_CANE,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomChildContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
