import { toast } from 'react-toastify';

export const getGoogleDirections = async ({ userLocation, data }) => {
  try {
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      // eslint-disable-next-line no-undef
      origin: new google.maps.LatLng(
        parseFloat(userLocation?.latitude),
        parseFloat(userLocation?.longitude)
      ),
      // eslint-disable-next-line no-undef
      destination: new google.maps.LatLng(
        parseFloat(data?.latitude),
        parseFloat(data?.longitude)
      ),
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    return {
      isSuccess: true,
      data: results,
    };
  } catch (error) {
    toast.error(error?.response?.data?.error || error.message);
    return {
      isError: true,
      data: error,
    };
  }
};

export const getTripDetailDirections = async ({
  origin,
  destination,
  stops,
}) => {
  try {
    let waypts = stops?.map((stop) => {
      return {
        location: stop,
        stopover: true,
      };
    });
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: origin?.text,
      destination: destination?.text,
      waypoints: waypts,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    return {
      isSuccess: true,
      data: results,
    };
  } catch (error) {
    toast.error(error?.response?.data?.error || error.message);
    return {
      isError: true,
      data: error,
    };
  }
};
