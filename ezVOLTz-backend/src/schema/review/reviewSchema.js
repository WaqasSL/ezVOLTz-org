import { number, object, string } from 'yup';

export const addReviewSchema = object({
  stationId: string().required('Station id is required.'),
  stationType: string().required('Station type is required.'),
  rating: number().required('Rating is required.'),
  comment: string(),
  userId: string().required('User id is required.'),
});

export const udpateReviewSchema = object({
  stationId: string().required('Station id is required.'),
  stationType: string().required('Station type is required.'),
  rating: number().required('Rating is required.'),
  comment: string(),
  userId: string().required('User id is required.'),
  reviewId: string().required('Review id is required.'),
});
