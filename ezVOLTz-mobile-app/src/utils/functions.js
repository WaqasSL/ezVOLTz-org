import { Linking } from "react-native";
import intervalToDuration from "date-fns/intervalToDuration";
import polyline from "@mapbox/polyline";
import Geocoder from "react-native-geocoding";
import moment from "moment";
import { isEmpty, isUndefined } from "lodash";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toast } from "@backpackapp-io/react-native-toast";
import Snackbar from "react-native-snackbar";

import { GOOGLE_KEY } from "@env";
import { BLACK_VELVET, WHITE } from "../constants/colors";

Geocoder.init(GOOGLE_KEY);

export const showSnackDanger = (message) => {
  Snackbar.show({
    text: message,
    duration: Snackbar.LENGTH_LONG,
    backgroundColor: BLACK_VELVET,
    textColor: WHITE,
  });
};

export const showSnackSuccess = (message) => {
  Snackbar.show({
    text: message,
    duration: Snackbar.LENGTH_LONG,
    backgroundColor: BLACK_VELVET,
    textColor: WHITE,
  });
};

export const notificationUrl = (data) => {
  const url = data?.split("/")?.pop();
  return url;
};

export const formatDate = (value) => {
  return moment(value).format("MM/DD/YYYY");
};

export const formatTime = (value) => {
  return moment(new Date(value), ["HH.mm"])
    .format("hh:mm a")
    .toLocaleUpperCase();
};

export const formatChargeTime = (value) => {
  return moment(value).format(`MM/DD/YYYY HH:mm`);
};

export const openURL = (url) => {
  Linking.openURL(url);
};

export const formatCounts = (number) => {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  }
  return number.toString();
};

export const filterUpcomingTrips = (trips) => {
  const currentDate = new Date();

  // Filter upcoming trips
  const upcomingTrips = trips?.filter((trip) => {
    if (trip.status !== "upcoming") return false;

    const tripStartDate = trip.startDate ? new Date(trip.startDate) : null;
    const tripStartTime = trip.startTime ? new Date(trip.startTime) : null;

    // If trip has startTime and it's in the future, return true
    if (tripStartTime && tripStartTime > currentDate) return true;

    // If trip has startDate and it's in the future, return true
    if (tripStartDate && tripStartDate > currentDate) return true;

    // If trip has startDate but no startTime, return true if it's today
    if (tripStartDate && !tripStartTime) {
      const isSameDay =
        tripStartDate.getDate() === currentDate.getDate() &&
        tripStartDate.getMonth() === currentDate.getMonth() &&
        tripStartDate.getFullYear() === currentDate.getFullYear();
      return isSameDay;
    }

    // If trip has no startDate and no startTime, return true
    return !tripStartDate && !tripStartTime;
  });

  // Sort the upcomingTrips based on priority (startTime > startDate > no startTime/startDate)
  const sortedUpcomingTrips = upcomingTrips?.sort((a, b) => {
    // Function to compare trips based on priority
    const comparePriority = (trip) => {
      if (trip.startTime) return 1;
      if (trip.startDate) return 2;
      return 3;
    };

    // Compare trips based on priority
    const priorityDiff = comparePriority(a) - comparePriority(b);
    if (priorityDiff !== 0) return priorityDiff;

    // If both trips have same priority, sort based on startTime
    if (a.startTime && b.startTime) {
      return new Date(a.startTime) - new Date(b.startTime);
    }

    // If both trips have same priority but no startTime, sort based on startDate
    if (a.startDate && b.startDate) {
      return new Date(a.startDate) - new Date(b.startDate);
    }

    // If both trips have same priority but no startTime/startDate, maintain the current order
    return 0;
  });

  return sortedUpcomingTrips;
};

export const filterPastTrips = (trips) => {
  const currentDate = new Date();

  const filteredTrips = trips?.filter((trip) => {
    if (!trip.startTime && !trip.startDate && trip?.status === "upcoming")
      return false; // Exclude trips without start time or start date

    if (trip.startDate && !trip.startTime) {
      const tripStartDate = new Date(trip.startDate);
      const currentDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
      );
      return tripStartDate < currentDay || trip.status !== "upcoming";
    }

    const tripStart = trip.startTime || trip.startDate;

    return new Date(tripStart) < currentDate || trip.status !== "upcoming";
  });

  return filteredTrips?.sort((a, b) => {
    // Map status to priority level
    const statusPriority = {
      inprogress: 0,
      completed: 1,
      upcoming: 2,
    };

    // Compare status based on priority
    const statusDiff = statusPriority[a.status] - statusPriority[b.status];
    if (statusDiff !== 0) return statusDiff;

    // If status is same, sort by startDate
    return new Date(b.startDate) - new Date(a.startDate);
  });
};

export const dateComing = (upcomingDate) => {
  let difference = intervalToDuration({
    start: new Date(upcomingDate),
    end: new Date(),
  });
  return `${
    difference?.years > 0
      ? `${difference.years} year${difference.years === 1 ? "" : "s"}`
      : ""
  }  ${
    difference.months > 0
      ? `${difference.months} month${difference.months === 1 ? "" : "s"}`
      : ""
  }  ${
    difference.days > 0
      ? `${difference.days} day${difference.days === 1 ? "" : "s"}`
      : ""
  }`;
};

export const timeAgo = (pastDate) => {
  let difference = intervalToDuration({
    start: new Date(),
    end: new Date(pastDate),
  });
  return difference?.years > 0
    ? `${difference.years} ${difference.years === 1 ? "year" : "years"} ago`
    : difference.months > 0
    ? `${difference.months} ${difference.months === 1 ? "month" : "months"} ago`
    : difference.days > 0
    ? `${difference.days} ${difference.days === 1 ? "day" : "days"} ago`
    : difference.hours > 0
    ? `${difference.hours} ${difference.hours === 1 ? "hour" : "hours"} ago`
    : `${difference.minutes} ${
        difference.minutes === 1 ? "minute" : "minutes"
      } ago`;
};

export const getRouteEvs = async ({ retry = false, tripData }) => {
  try {
    const wayPointStr =
      tripData?.stops?.length > 0
        ? tripData.stops.map((item) => item.name).join("|")
        : "";

    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${
      tripData.origin?.text
    }&destination=${
      tripData.destination?.text
    }&waypoints=${wayPointStr}&key=${GOOGLE_KEY}&mode=driving${
      tripData?.avoidTolls ? `&avoid=tolls` : ``
    }${tripData?.avoidHighways ? `&avoid=highways` : ``}`;

    const response = await fetch(url);
    const result = await response.json();

    const overviewPath = result?.routes[0].overview_polyline.points;
    const decodedPath = polyline.decode(overviewPath);
    let line = [];

    if (retry) {
      decodedPath?.forEach((item, index) => {
        if (index === decodedPath?.length - 1) line += `${item[1]} ${item[0]}`;
        else if (index % 2 === 0) line += `${item[1]} ${item[0]}, `;
      });
    } else {
      line = decodedPath?.map((item) => `${item[1]} ${item[0]}`)?.join(", ");
    }

    let evDataUrl = `https://developer.nrel.gov/api/alt-fuel-stations/v1/nearby-route.json?route=LINESTRING(${line})&distance=1&api_key=vecxF0TFskfhThM80jm5VjSt4niUZzEVijHXSmDz&ev_network=${
      tripData?.network === `ezvoltz` ? `all` : tripData?.network
    }&ev_connector_type=${tripData?.connector}&status=all`;

    const evDataResponse = await fetch(evDataUrl);

    if (!evDataResponse.ok) {
      if (evDataResponse.status === 414) {
        console.error("HTTP Error: 414 URI Too Long");
        await getRouteEvs({ retry: true, tripData });
      } else {
        console.error(`HTTP Error: ${evDataResponse.status}`);
        throw new Error("Network response was not ok");
      }
    }

    const evDataResult = await evDataResponse.json();

    if (!evDataResult) {
      showSnackDanger(`No fuel systems found`);
    } else {
      return evDataResult;
    }
  } catch (error) {
    console.error("Error in getDirectionsAndEvData:", error);
  }
};

export const getStopsCoordinates = async (data) => {
  try {
    const promises = data?.stops.map(async (stop) => {
      return new Promise((resolve) => {
        Geocoder.from(stop.name).then((result) => {
          resolve({
            name: stop.name,
            latitude: result.results[0].geometry.location.lat,
            longitude: result.results[0].geometry.location.lng,
            ...(!isUndefined(stop.type) && { type: stop.type }),
          });
        });
      });
    });

    const result = await Promise.all(promises);
    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const animateMapToRegion = async (data, mapRef) => {
  const coordinates = [
    { latitude: data?.origin?.latitude, longitude: data?.origin?.longitude },
    {
      latitude: data?.destination?.latitude,
      longitude: data?.destination?.longitude,
    },
    ...(data.stops || []).map(async (stop) => {
      const locationData = await Geocoder.from(stop.name);
      return {
        latitude: locationData.results[0].geometry.location.lat,
        longitude: locationData.results[0].geometry.location.lng,
      };
    }),
  ];

  const timer = setTimeout(() => {
    mapRef.current?.fitToCoordinates(
      coordinates,
      {
        edgePadding: {
          top: 60,
          right: 60,
          bottom: 60,
          left: 60,
        },
      },
      2000,
    );
  }, 1000);

  return () => {
    clearTimeout(timer);
  };
};

export const mapMakes = (data) => {
  const makes = data.map((item) => {
    const make = {
      label: item?.make,
      value: item?._id,
      models: item?.models,
    };
    return make;
  });

  return makes.sort((a, b) => a.label.localeCompare(b.label));
};

export const mapModels = (data) => {
  const models = data.map((item) => {
    const model = {
      label: item?.model,
      value: item?._id,
      range: item?.range,
    };
    return model;
  });

  return models.sort((a, b) => a.label.localeCompare(b.label));
};

export const getModelsByMakeId = (data, id) => {
  const make = data.find((item) => item._id === id);
  return mapModels(make?.models);
};

export const secondsToDHMS = (seconds) => {
  seconds = Number(seconds);
  let d = Math.floor(seconds / (3600 * 24));
  let h = Math.floor((seconds % (3600 * 24)) / 3600);
  let m = Math.floor((seconds % 3600) / 60);
  let s = Math.floor(seconds % 60);

  let dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  let mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes ") : "";
  let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay;
};

export const getDirectionsAndEstimates = async (trip, setApiLoading) => {
  const wayPoints = trip.stops
    .filter((stop) => stop.name)
    .map((stop) => stop.name);
  const wayPointStr = wayPoints.length > 0 ? wayPoints.join("|") : "";

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${
    trip.origin.name
  }&destination=${
    trip.destination.name
  }&waypoints=${wayPointStr}&key=${GOOGLE_KEY}&mode=driving${
    trip.avoidTolls ? "&avoid=tolls" : ""
  }${trip.avoidHighways ? "&avoid=highways" : ""}`;

  setApiLoading(true);

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (
      result?.status === "NOT_FOUND" ||
      result?.status === "ZERO_RESULTS" ||
      result?.status === "REQUEST_DENIED" ||
      result?.routes?.length <= 0
    ) {
      showSnackDanger(
        "No route found against these points. Please enter valid points.",
      );
      return null;
    }

    let distance = 0;
    let durationInSeconds = 0;
    let ceDistance = 0;

    result?.routes[0]?.legs?.forEach(
      ({
        distance: { value: legDistance },
        duration: { value: legDuration },
      }) => {
        distance += legDistance;
        durationInSeconds += legDuration;
        ceDistance += legDistance;
      },
    );

    const finalDistance = distance * 0.000621371192;
    const myduration = secondsToDHMS(durationInSeconds);
    const durationInHours = durationInSeconds / 3600;

    //calculate cost & energy

    const batteryCapacity = parseInt(
      trip?.vehicle?.model?.batteryCapacity ??
        trip?.vehicle?.make?.models[0]?.batteryCapacity,
    );

    const range = parseInt(trip.vehicle?.range);

    const energy = `${Math.round(
      (batteryCapacity / range) * (ceDistance / 1000),
    )} kWh`;

    const costMin = trip.network.value === "Tesla" ? 0.4 : 0.2;
    const costMax = trip.network.value === "Tesla" ? 0.5 : 0.3;

    const cost = `$${Math.round(
      (batteryCapacity / range) * (ceDistance / 1000) * costMin,
    )} to $${Math.round(
      (batteryCapacity / range) * (ceDistance / 1000) * costMax,
    )} EST`;

    return {
      distance: `${Math.round(finalDistance)} miles`,
      timeDuration: myduration,
      speed: `${Math.round(finalDistance / durationInHours)} mph`,
      directions: result,
      cost,
      energy,
    };
  } catch (error) {
    console.error("Error calculating route info:", error);
    return null;
  } finally {
    setApiLoading(false);
  }
};

export const getRouteEvs_ = async ({ retry = false, trip }) => {
  try {
    const overviewPath =
      trip.directions.directions.routes[0].overview_polyline.points;
    const decodedPath = polyline.decode(overviewPath);
    let line = decodedPath.map((item) => `${item[1]} ${item[0]}`).join(", ");

    const url = `https://developer.nrel.gov/api/alt-fuel-stations/v1/nearby-route.json?route=LINESTRING(${line})&distance=1&api_key=vecxF0TFskfhThM80jm5VjSt4niUZzEVijHXSmDz&ev_network=${
      trip.network.value === `ezvoltz` ? `all` : trip.network.value
    }&ev_connector_type=${trip.connector.value}&status=all`;

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 414 && !retry) {
        return getRouteEvs_({ retry: true, trip });
      }

      throw new Error(
        `Network response was not ok. Status: ${response.status}`,
      );
    }

    const result = await response.json();

    if (!result) {
      toast.show({ description: "No fuel systems found", duration: 1000 });
    } else {
      return {
        result,
        decodedPath,
      };
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

export const setMapRegionAndFitToCoordinates = (trip, mapRef) => {
  const timer = setTimeout(() => {
    mapRef?.current?.animateToRegion({
      latitude: trip.origin.latitude,
      longitude: trip.origin.longitude,
      latitudeDelta: 100,
      longitudeDelta: 100,
    });

    let array = [
      {
        latitude: trip.origin.latitude,
        longitude: trip.origin.longitude,
      },
      {
        latitude: trip.destination.latitude,
        longitude: trip.destination.longitude,
      },
    ];

    trip.stops.map((item, index) => {
      array.push({
        latitude: item.latitude,
        longitude: item.longitude,
      });
    });

    mapRef.current?.fitToCoordinates(
      array,
      {
        edgePadding: {
          top: 60,
          right: 60,
          bottom: 60,
          left: 60,
        },
      },
      2000,
    );
  }, 1000);

  return () => {
    clearTimeout(timer);
  };
};

export const validateTrip = (data) => {
  const { origin, stops, destination, vehicle } = data;

  if (isEmpty(origin)) {
    showSnackDanger(`Starting location cannot be empty`);
    return false;
  }
  if (isEmpty(destination)) {
    showSnackDanger(`Destination cannot be empty`);
    return false;
  }
  if (isEmpty(vehicle)) {
    showSnackDanger(`Vehicle cannot be empty`);
    return false;
  }

  // if origin and destination are same
  if (origin.name === destination.name) {
    showSnackDanger(`Trip starting location and destination can not be same`);
    return false;
  }

  // Check if any consecutive stops have the same name
  for (let i = 0; i < stops.length - 1; i++) {
    if (
      stops[i].name !== `` &&
      stops[i + 1].name !== `` &&
      stops[i].name === stops[i + 1].name
    ) {
      showSnackDanger("Consecutive stops cannot be same");
      return false;
    }
  }

  // if origin and first are same
  if (stops.length > 0 && origin.name === stops[0].name) {
    showSnackDanger(
      "Trip starting location and the first stop cannot be the same",
    );
    return false;
  }

  // if destination and last stop are same
  const lastStopIndex = stops.length - 1;
  if (lastStopIndex >= 0 && destination.name === stops[lastStopIndex].name) {
    showSnackDanger("Trip destination and the last stop cannot be the same");
    return false;
  }

  return true;
};

export const removeDuplicateObjArray = (array, key) => {
  return [...new Map(array.map((item) => [item[key], item])).values()];
};

export const navigateToMap = (origin, destination) => {
  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=driving&key=${GOOGLE_KEY}`;

  Linking.openURL(url);
};

export const openMap = (origin, destination, stops, ev) => {
  if (!isEmpty(stops)) {
    const slicedArray = ev.slice(0, ev.length - stops.length);
    const waypoints = stops.map((item) => `${item.name}`).join("|");
    const evStations = slicedArray
      .map((item) => `${item.latitude.toString()},${item.longitude.toString()}`)
      .join("|");
    let updatedWaypoints = waypoints.concat("|", evStations);
    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin?.text}&destination=${destination?.text}&waypoints=${updatedWaypoints}&travelmode=driving&key=${GOOGLE_KEY}`;
    Linking.openURL(url);
  } else {
    const evStations = ev
      .map((item) => `${item.latitude.toString()},${item.longitude.toString()}`)
      .join("|");
    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin?.text}&destination=${destination?.text}&waypoints=${evStations}&travelmode=driving&key=${GOOGLE_KEY}`;
    Linking.openURL(url);
  }

  // const waypoints = stops.join("|");
  // let url = `https://www.google.com/maps/dir/?api=1&origin=${origin?.text}&destination=${destination?.text}&waypoints=${waypoints}&travelmode=driving&key=${GoogleKey}`;
  // Linking.openURL(url);
};

export const getValueStringWithSelectedItems = (data) => {
  return data
    .filter((item) => item.isSelected)
    .map((item) => item.value)
    .join(",");
};

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    return getFcmToken();
  }
};

const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem("fcmToken");
  if (!fcmToken) {
    try {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem("fcmToken", fcmToken);
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  }
  return fcmToken;
};

export const getFormatedTimeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - new Date(timestamp)) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };
  let counter;
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    counter = Math.floor(seconds / secondsInUnit);
    if (counter > 0) {
      if (counter === 1) {
        return `${counter} ${unit} ago`;
      } else {
        return `${counter} ${unit}s ago`;
      }
    }
  }
  return "Just now";
};
