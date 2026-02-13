import { object, string } from 'yup';

export const vehicleSchema = object({
  make: string().required('Vehicle Make is required.'),
  model: string().required('Vehicle Model is required.'),
  range: string().required('Vehicle Range is required.'),
  userId: string().required('User id is required.'),
});
