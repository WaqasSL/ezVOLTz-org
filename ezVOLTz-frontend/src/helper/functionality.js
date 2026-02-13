import { intervalToDuration } from 'date-fns';

export const androidUrl =
  'https://play.google.com/store/apps/details?id=com.ezvoltz.app';
export const iosUrl =
  'https://apps.apple.com/us/app/ezvoltz-ev-station-locator/id6444717255';

export const animationProps = {
  bottom: true,
  distance: '50px',
};

export const valdiationEmail = (email) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return true;
  return false;
};

export const checkUserAuthenticated = (userInfo) => {
  if (
    userInfo?.user?.role?.includes('guest') &&
    !userInfo?.accessToken &&
    !userInfo?.refereshToken
  )
    return false;
  return true;
};

export const initialValues = {
  startFrom: null,
  destination: null,
  inBetween: [],
  startDate: null,
  startTime: null,
  avoidTolls: false,
  compatible: false,
  avoidTraffic: false,
  avoidHighways: false,
  hotels: false,
  restaurants: false,
  campGround: false,
  vehicle: null,
  chargersType: 'allChargers',
  connectorType: 'all',
  network: 'all',
  distance: '',
  time: '',
  speed: '',
  energy: '',
  cost: '',
};

export const initialFilters = {
  fuel: 'all',
  owner: 'all',
  network: 'all',
  connector: 'all',
  status: false,
  previousStation: false,
  ev_dc_fast_num: true,
  ev_level1_evse_num: false,
  ev_level2_evse_num: true,
};

export const initialReviewUpdateValues = {
  isModal: false,
  data: null,
  url: '',
};

export const navigateFilterSteps = [
  {
    step: '01',
    title: 'Open the app',
    imageUrl: '/assets/images/locator/locatorImg1.png',
  },
  {
    step: '02',
    title: 'Filter your stations',
    imageUrl: '/assets/images/locator/locatorImg2.png',
  },
  {
    step: '03',
    title: 'Select a charger',
    imageUrl: '/assets/images/locator/locatorImg3.png',
  },
  {
    step: '04',
    title: 'Drive with confidence',
    imageUrl: '/assets/images/locator/locatorImg4.png',
  },
];

export const planTripSteps = [
  {
    step: '01',
    title: 'Select your destination',
    imageUrl: '/assets/images/planTrip/planTrip1.png',
  },
  {
    step: '02',
    title: 'View your route',
    imageUrl: '/assets/images/planTrip/planTrip2.png',
  },
  {
    step: '03',
    title: 'Plan stops using Range Halo™',
    imageUrl: '/assets/images/planTrip/planTrip3.png',
  },
];

export const secondsToDHMS = (seconds) => {
  seconds = Number(seconds);
  let d = Math.floor(seconds / (3600 * 24));
  let h = Math.floor((seconds % (3600 * 24)) / 3600);
  let m = Math.floor((seconds % 3600) / 60);

  let dDisplay = d > 0 ? d + (+d === 1 ? ' day, ' : ' days, ') : '';
  let hDisplay = h > 0 ? h + (+h === 1 ? ' hour, ' : ' hours, ') : '';
  let mDisplay = m > 0 ? m + (+m === 1 ? ' minute, ' : ' minutes') : '';
  return dDisplay + hDisplay + mDisplay;
};

export function dateAgo(pastDate) {
  let difference = intervalToDuration({
    start: new Date(),
    end: new Date(pastDate),
  });
  return difference?.years > 0
    ? `${difference.years} ${difference.years === 1 ? 'y' : 'y'}`
    : difference.months > 0
    ? `${difference.months} ${difference.months === 1 ? 'm' : 'm'}`
    : difference.days > 0
    ? `${difference.days} ${difference.days === 1 ? 'd' : 'd'}`
    : difference.hours > 0
    ? `${difference.hours} ${difference.hours === 1 ? 'h' : 'h'}`
    : `${difference.minutes} ${difference.minutes === 1 ? 'm' : 'm'}`;
}

export function dateComing(upcomingDate) {
  if (!upcomingDate) return '';
  let difference = intervalToDuration({
    start: new Date(upcomingDate),
    end: new Date(),
  });
  return `${
    difference?.years > 0
      ? `${difference.years} year${difference.years === 1 ? '' : 's'}`
      : ''
  }  ${
    difference.months > 0
      ? `${difference.months} month${difference.months === 1 ? '' : 's'}`
      : ''
  }  ${
    difference.days > 0
      ? `${difference.days} day${difference.days === 1 ? '' : 's'}`
      : ''
  }`;
}

export function getTimeRemaining(endtime) {
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
}

export function filterAndSortUpcomingTrips(trips) {
  const upcomingTrips = trips?.filter((trip) => {
    const currentDate = new Date();

    if (trip.status !== 'upcoming') return false;

    if (!trip.startDate && !trip.startTime) return true;
    if (trip.startTime && new Date(trip.startTime) > currentDate) return true;

    if (trip.startDate) {
      const tripStartDate = new Date(trip.startDate);

      if (
        tripStartDate.getFullYear() > currentDate.getFullYear() ||
        (tripStartDate.getFullYear() === currentDate.getFullYear() &&
          tripStartDate.getMonth() > currentDate.getMonth()) ||
        (tripStartDate.getFullYear() === currentDate.getFullYear() &&
          tripStartDate.getMonth() === currentDate.getMonth() &&
          tripStartDate.getDate() > currentDate.getDate())
      ) {
        return true;
      }

      if (
        tripStartDate.getFullYear() === currentDate.getFullYear() &&
        tripStartDate.getMonth() === currentDate.getMonth() &&
        tripStartDate.getDate() === currentDate.getDate() &&
        !trip.startTime
      ) {
        return true;
      }
    }

    return false;
  });

  return upcomingTrips
    ?.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .reverse();
}

export function filterAndSortPreviousTrips(trips) {
  const currentDate = new Date();

  const filteredTrips = trips?.filter((trip) => {
    if (!trip.startTime && !trip.startDate && trip?.status === 'upcoming')
      return false; // Exclude trips without start time or start date

    if (trip.startDate && !trip.startTime) {
      const tripStartDate = new Date(trip.startDate);
      const currentDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      );
      return tripStartDate < currentDay || trip.status !== 'upcoming';
    }

    const tripStart = trip.startTime || trip.startDate;

    return new Date(tripStart) < currentDate || trip.status !== 'upcoming';
  });

  return filteredTrips?.sort((a, b) => {
    if (a.status === 'inprogress' && b.status !== 'inprogress') {
      return -1; // 'in progress' comes first
    }
    if (a.status !== 'inprogress' && b.status === 'inprogress') {
      return 1; // 'in progress' comes first
    }
    return new Date(b.startDate) - new Date(a.startDate);
  });
}

export const tripStatus = {
  isCompleted: 'completed',
  inProgress: 'inprogress',
  isCancelled: 'cancelled',
  notStarted: 'notStarted',
};

export const allStopsEqual = (arr) =>
  arr.every((obj, index, array) => obj['value'] === array[0]['value']);
