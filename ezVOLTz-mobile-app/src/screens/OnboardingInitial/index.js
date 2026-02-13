import React, {useCallback, useState} from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
// import Carousel, {Pagination} from 'react-native-snap-carousel';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

import VerticalSpace from '../../components/VerticalSpace';
import HorizontalSpace from '../../components/HorizontalSpace';
import TextButton from '../../components/Buttons/TextButton';
import SolidButton from '../../components/Buttons/SolidButton';

import {
  ONBOARDING_BG,
  EZVOLTZ_LOGO_PRIMARY,
  ONBOARDING_1,
  ONBOARDING_2,
  ONBOARDING_3,
} from '../../constants/svg';
import {BERTIOGASANS_BOLD, BERTIOGASANS_REGULAR} from '../../constants/fonts';
import {WHITE, FLINT_STONE, BLACK, BLUE_LOBSTER} from '../../constants/colors';
import {
  heightRem,
  screenRem,
  width,
  widthRem,
} from '../../constants/dimensions';
import {ARROW_RIGHT} from '../../assets/icons';
import {
  setDisplayOnboarding,
  setAuthFields,
} from '../../redux/slices/auth/slice';

const DATA = [
  {
    image: <ONBOARDING_1 />,
    heading: 'Let’s Start Your Charging Activity',
    info: `Find nearby charging stations and get directions\nat the tap of a button.`,
  },
  {
    image: <ONBOARDING_2 />,
    heading: 'Plan a Trip',
    info: `Setup multiple stops along the way.`,
  },
  {
    image: <ONBOARDING_3 />,
    heading: 'Join the EV Community',
    info: `Add a charging station photo, leave a review, or\nreply to other comments.`,
  },
];

const OnboardingInitial = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [carouselData] = useState(DATA);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToOnboardingSecondary = useCallback(() => {
    dispatch(setAuthFields({displayOnboarding: false}));
    navigation.reset({
      index: 0,
      routes: [{name: 'OnboardingSecondary'}],
    });
  }, [navigation]);

  const goToHome = useCallback(() => {
    dispatch(setAuthFields({displayOnboarding: false}));
    navigation.reset({
      index: 0,
      routes: [{name: 'AppTabs'}],
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ONBOARDING_BG style={styles.onboardingBG} />

      <View style={styles.mainContainer}>
        <View style={styles.logoContainer}>
          <VerticalSpace h={2} />
          <EZVOLTZ_LOGO_PRIMARY />
        </View>

        <View style={styles.carouselContainer}>
          {/* <Carousel
            containerCustomStyle={styles.carouselContainerCustom}
            layout={'default'}
            data={carouselData}
            sliderWidth={width}
            itemWidth={width}
            autoplay={true}
            autoplayInterval={4000}
            autoplayDelay={1000}
            loopClonesPerSide={carouselData.length}
            loop={true}
            enableMomentum={false}
            lockScrollWhileSnapping={true}
            onSnapToItem={index => setActiveIndex(index)}
            renderItem={({item, index}) => (
              <View key={index} style={styles.carouselContentContainer}>
                {item.image}

                <VerticalSpace h={2} />

                <Text style={styles.carouselHeadingText}>{item.heading}</Text>

                <VerticalSpace h={2} />

                <Text style={styles.carouselInfoText}>{item.info}</Text>
              </View>
            )}
          /> */}

          <VerticalSpace h={3} />

          {/* <Pagination
            dotsLength={carouselData.length}
            activeDotIndex={activeIndex}
            dotStyle={styles.dot}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            containerStyle={styles.paginationContainer}
          /> */}
        </View>

        <View style={styles.bottomContainer}>
          <TextButton
            label={`Continue as a Guest`}
            customTextStyle={{color: BLUE_LOBSTER}}
            onPress={goToHome}
          />

          <SolidButton
            label={`Next`}
            size={`sm`}
            onPress={goToOnboardingSecondary}>
            <HorizontalSpace w={2} />
            <ARROW_RIGHT height={screenRem * 1.4} width={screenRem * 1.4} />
          </SolidButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingInitial;

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  onboardingBG: {
    position: 'absolute',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {alignSelf: 'center'},
  carouselContainer: {
    alignItems: 'center',
  },
  carouselContainerCustom: {flexGrow: 0},
  carouselContentContainer: {
    alignItems: 'center',
  },
  carouselHeadingText: {
    fontFamily: BERTIOGASANS_BOLD,
    fontSize: screenRem * 1.6,
    textAlign: 'center',
    color: BLACK,
  },
  carouselInfoText: {
    fontFamily: BERTIOGASANS_REGULAR,
    fontSize: screenRem * 1.2,
    textAlign: 'center',
    color: FLINT_STONE,
    lineHeight: screenRem * 2,
    width: widthRem * 92,
  },
  dot: {
    backgroundColor: FLINT_STONE,
  },
  paginationContainer: {paddingVertical: 0},
  bottomContainer: {
    marginHorizontal: widthRem * 4,
    marginBottom: heightRem * 2,
    marginTop: heightRem * 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
