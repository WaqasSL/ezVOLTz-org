import React from "react";
import useState from "react-usestateref";
import Geocoder from "react-native-geocoding";

import { GOOGLE_KEY } from "@env";

Geocoder.init(GOOGLE_KEY);

let radius;
const useCalculateRangeHalo = () => {
  const [_a, setCurrentLocation, currentLocationRef] = useState({});
  const [_b, setCoordinates, coordinatesRef] = useState([]);
  const [_c, setLoading, loadingRef] = useState(true);

  // calculating next point from current coordinates inside specific range

  function calculateNextInMiles(
    startLatitude,
    startLongitude,
    routeCoordinates,
    percentOfRange
  ) {
    const earthRadius = 3959; // Radius of the Earth in miles

    let distance = 0;
    let destinationIndex = -1;

    for (let i = 0; i < routeCoordinates.length - 1; i++) {
      const { latitude: lat1, longitude: lon1 } =
        i === 0
          ? { latitude: startLatitude, longitude: startLongitude }
          : routeCoordinates[i];
      const { latitude: lat2, longitude: lon2 } = routeCoordinates[i + 1];

      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
          Math.cos(toRadians(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const segmentDistance = earthRadius * c;

      if (distance + segmentDistance >= percentOfRange) {
        destinationIndex = i + 1; // Index of the next point after reaching 70 miles
        break;
      }

      distance += segmentDistance;
    }

    if (destinationIndex !== -1) {
      // The destination point is found
      const destinationPoint = routeCoordinates[destinationIndex];
      setCoordinates([...coordinatesRef.current, destinationPoint]);
      setCurrentLocation(destinationPoint);

      calculateNextInMiles(
        destinationPoint.latitude,
        destinationPoint.longitude,
        routeCoordinates.slice(destinationIndex),
        percentOfRange
      );
    }
  }

  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  //

  const calculateRangeHalo = async (data, range, distanceInMiles, origin) => {
    let distance = Number(distanceInMiles.split(/(\s+)/)[0]);

    let percentOfRange;

    if (distance < range) {
      percentOfRange = distance / 2;
      radius = distance / 8;
    } else {
      percentOfRange = (70 / 100) * range;
      radius = 25;
    }

    await Geocoder.from(origin)
      .then((json) => {
        let location = json.results[0].geometry.location;
        setCurrentLocation({
          latitude: location.lat,
          longitude: location.lng,
        });
      })
      .catch(() => {});

    const updatedCoordinates = [
      ...new Set(
        data.reduce(
          (acc, cur) => [...acc, { latitude: cur[0], longitude: cur[1] }],
          []
        )
      ),
    ];

    calculateNextInMiles(
      currentLocationRef.current?.latitude,
      currentLocationRef.current?.longitude,
      updatedCoordinates,
      percentOfRange
    );

    setLoading(false);
  };

  return {
    radius,
    rangeHaloCoordinates: coordinatesRef.current,
    calculateRangeHalo,
    loadingRangeHalo: loadingRef.current,
  };
};

export default useCalculateRangeHalo;
