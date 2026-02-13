import React from "react";
import { InfoCircle, TickCircle } from "iconsax-react-native";
import { BannerAdSize } from "react-native-google-mobile-ads";

import { BERN_RED, BLACK_GREY, BLUE_LOBSTER, FRIENDLY_BASILISK, HARVARD_CRIMSON, JASPER_CANE, SPANDEX_GREEN, THEME, VITAMIN_C, WHITE, WHITE_SMOKE, WILD_DOVE } from "./colors";
import { screenRem, widthRem } from "./dimensions";
import { LEVEL1, LEVEL2, PRIVATE, DCFAST, PIN, SAAS } from "../assets/icons";
import images from "./images";

//button sizes
export const ButtonSize = {
  sm: widthRem * 26,
  md: widthRem * 38,
  lg: widthRem * 62,
  xl: widthRem * 92,
};

//past trips
export const pastTripsStatusText = {
  completed: "Completed",
  inprogress: "In Progress",
};

export const pastTripsStatusIcon = {
  completed: <TickCircle size={screenRem * 1.2} color={WHITE} />,
  inprogress: <InfoCircle size={screenRem * 1.2} color={WHITE} />,
};

export const pastTripBadgeColor = {
  completed: THEME,
  inprogress: VITAMIN_C,
};

//markers
export const markerType = {
  level1: <LEVEL1 />,
  level2: <LEVEL2 />,
  private: <PRIVATE />,
  dcfast: <DCFAST />,
  pin: <PIN />,
  saas: <SAAS />,
};

//charging stations
export const chargingStationStatus = {
  P: "Planned",
  E: "Available",
  T: "Temporarily Unavailable",
};

export const chargingStationColor = {
  P: BLUE_LOBSTER,
  E: THEME,
  T: BERN_RED,
};

//payment card images
export const paymentCards = {
  mastercard: images.mastercard,
  visa: images.visa,
  unionpay: images.unionpay,
  discover: images.discover,
  jcb: images.jcb,
  amex: images.amex,
};

// trip status
export const tripStatus = {
  isCompleted: "completed",
  inProgress: "inprogress",
  isCancelled: "cancelled",
  notStarted: "notStarted",
};

//saas connector status badge
export const saasConnectorStatuBadge = {
  Unavailable: BERN_RED,
  Available: THEME,
  Charging: VITAMIN_C,
  Preparing: VITAMIN_C
};

export const adSize = {
  ANCHORED_ADAPTIVE_BANNER: BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
  BANNER: BannerAdSize.BANNER,
  FULL_BANNER: BannerAdSize.FULL_BANNER,
  INLINE_ADAPTIVE_BANNER: BannerAdSize.INLINE_ADAPTIVE_BANNER,
  LARGE_BANNER: BannerAdSize.LARGE_BANNER,
  LEADERBOARD: BannerAdSize.LEADERBOARD,
  MEDIUM_RECTANGLE: BannerAdSize.MEDIUM_RECTANGLE,
  WIDE_SKYSCRAPER: BannerAdSize.WIDE_SKYSCRAPER,
}


export const chargerStatus = {
  preparing: 'Preparing',
  charging: 'Charging',
  charged: 'Charged',
  cancelled: 'Cancelled'
}


export const chargerStatusBgColor = {
  preparing: JASPER_CANE,
  charging: VITAMIN_C,
  charged: SPANDEX_GREEN,
  cancelled: HARVARD_CRIMSON,
}

export const chargerStatusIconColor = {
  preparing: BLACK_GREY,
  charging: WHITE_SMOKE,
  charged: WHITE_SMOKE,
  cancelled: WHITE_SMOKE,
}

export const chargerStatusTextColor = {
  preparing: BLACK_GREY,
  charging: WHITE_SMOKE,
  charged: WHITE_SMOKE,
  cancelled: WHITE_SMOKE,
}

