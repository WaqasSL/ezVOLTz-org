import { useState, useEffect } from 'react';

const useHaloRange = () => {
  const [halos, setHalos] = useState([]);
  const [loading, setLoading] = useState(false);
  // This effect is triggered whenever halos need to be recalculated

  const calculateHaloRange = async (routeData, vehicleRange) => {
    setLoading(true);

    try {
      const routeCoordinates = parseRouteCoordinates(routeData);
      const targetDistance = 0.7 * vehicleRange;

      let totalDistance = 0;
      let nextHalos = [];

      for (let i = 0; i < routeCoordinates.length - 1; i++) {
        const { lat: lat1, lng: lng1 } = routeCoordinates[i];
        const { lat: lat2, lng: lng2 } = routeCoordinates[i + 1];

        const distanceBetweenPoints = calculateDistance(lat1, lng1, lat2, lng2);
        if (totalDistance + distanceBetweenPoints >= targetDistance) {
          nextHalos.push(routeCoordinates[i]);
          totalDistance = 0;
        } else {
          totalDistance += distanceBetweenPoints;
        }
      }

      setHalos(nextHalos);
    } catch (error) {
      console.error('Error calculating halo range:', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    return () => {
      setHalos([]); // Clear halos when the effect is cleaned up
    };
  }, []);

  const parseRouteCoordinates = (routeData) => {
    return routeData.overview_path.map((step) => ({
      lat: step.lat(),
      lng: step.lng(),
    }));
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const earthRadius = 3959; // Radius of the Earth in miles
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
  };

  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  return {
    loading,
    halos,
    calculateHaloRange,
  };
};

export default useHaloRange;
