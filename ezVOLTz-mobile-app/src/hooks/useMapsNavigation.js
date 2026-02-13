import useState from "react-usestateref";
import { isUndefined } from "lodash";
import polyline from "@mapbox/polyline";
import { GOOGLE_KEY } from "@env";

import { openMap } from "../utils/functions";

const useMapsNavigation = () => {
  const [initializeMapLoading, setInitializeMapLoading] = useState(false);
  const [_, setCurrentLocation, currentLocationRef] = useState({});
  const [__, setCoordinates, coordinatesRef] = useState([]);

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

  const intializeMapNavigation = async (data, retry = false) => {
    setInitializeMapLoading(true);

    const hasWaypoint = data?.stops.some((item) => item.type === "waypoint");

    if (!hasWaypoint) {
      setCurrentLocation({
        latitude: data?.origin?.latitude,
        longitude: data?.origin?.longitude,
      });

      const range = data?.vehicleId?.range || data?.range;

      let distance = data?.distance.split(/(\s+)/)[0];
      let percentOfRange;

      parseFloat(distance);
      parseFloat(range);

      if (distance < range) {
        percentOfRange = distance / 2;
      } else {
        percentOfRange = (70 / 100) * range;
      }

      const wayPointStr = data.stops.map((item) => `${item.name}`).join("|");

      let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${
        data.origin.text
      }&destination=${
        data.destination.text
      }&waypoints=${wayPointStr}&key=${GOOGLE_KEY}&mode=driving${
        data?.avoidTolls ? `&avoid=tolls` : ``
      }${data?.avoidHighways ? `&avoid=highways` : ``}`;

      await fetch(url)
        .then((response) => response.json())
        .then((result) => {
          const overviewPath = result?.routes[0].overview_polyline.points;
          const decodedPath = polyline.decode(overviewPath);

          let line = [];

          if (retry) {
            decodedPath?.map((item, index) => {
              if (index === decodedPath?.length - 1)
                line += `${item[1]} ${item[0]}`;
              else if (index % 2 === 0) line += `${item[1]} ${item[0]}, `;
            });
          } else {
            line = decodedPath
              ?.map((item) => `${item[1]} ${item[0]}`)
              ?.join(", ");
          }

          let nrelURL = `https://developer.nrel.gov/api/alt-fuel-stations/v1/nearby-route.json?route=LINESTRING(${line})&distance=1&api_key=vecxF0TFskfhThM80jm5VjSt4niUZzEVijHXSmDz&ev_network=${data?.network}&ev_connector_type=${data?.connector}&status=all`;

          fetch(nrelURL)
            .then((response) => {
              if (!response.ok) {
                // Handle other HTTP errors here
                if (response.status === 414) {
                  intializeMapNavigation(data, { retry: true });
                }
                console.error(`HTTP Error: ${response.status}`);
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((result) => {
              // Handle the successful response here
              let array = [];
              for (var i = 0; i < result?.fuel_stations.length; i = i + 1) {
                array.push({
                  latitude: result?.fuel_stations[Math.floor(i)].latitude,
                  longitude: result?.fuel_stations[Math.floor(i)].longitude,
                });
              }

              calculateNextInMiles(
                currentLocationRef.current?.latitude,
                currentLocationRef.current?.longitude,
                array,
                percentOfRange
              );

              setInitializeMapLoading(false);

              openMap(
                data.origin,
                data.destination,
                data.stops,
                coordinatesRef.current
              );
            })
            .catch((error) => {
              // Handle fetch errors or other exceptions here
              console.error("Fetch error:", error);
            });
        });
    } else {
      setInitializeMapLoading(false);

      openMap(data.origin, data.destination, data.stops, []);
    }
  };

  return { initializeMapLoading, intializeMapNavigation };
};

export default useMapsNavigation;
