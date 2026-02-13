import { array, boolean, number, object, string } from 'yup';

export const addTripSchema = object({
  origin: object().shape({
    text: string().required('Origin location is required.'),
    latitude: number().required('Origin latitude is required.'),
    longitude: number().required('Origin longitude is required.'),
  }),
  stops: array().of(
    object({
      name: string(),
      type: string(),
    })
  ),
  destination: object().shape({
    text: string().required('Destination location is required.'),
    latitude: number().required('Destination latitude is required.'),
    longitude: number().required('Destination longitude is required.'),
  }),
  startDate: string().nullable(),
  startTime: string().nullable(),
  chargersType: string().required('Chargers type is required.'),
  connector: string().required('Connector is required.'),
  network: string().required('Network is required.'),
  distance: string().required('Distance is required.'),
  time: string().required('Time is required.'),
  speed: string().required('Speed is required.'),
  energy: string().required('Energy is required.'),
  cost: string().required('Cost is required.'),
  vehicleId: string().required('Vehicle id is required.'),
  avoidTolls: boolean(),
  avoidTraffic: boolean(),
  avoidHighways: boolean(),
  hotels: boolean(),
  restaurants: boolean(),
  campGround: boolean(),
});
