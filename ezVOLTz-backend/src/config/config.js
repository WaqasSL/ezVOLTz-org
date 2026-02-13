import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

const bucketRegion = process.env.S3_BUCKET_REGION;
const bucketAccessKey = process.env.S3_BUCKET_ACCESS_KEY;
const bucketSecretKey = process.env.S3_BUCKET_SECRET_ACCESS_KEY;

export const s3Client = new S3Client({
  credentials: {
    accessKeyId: bucketAccessKey,
    secretAccessKey: bucketSecretKey,
  },
  region: bucketRegion,
});

export const errorMessage = (res, error) => {
  if (error) {
    if (error?.response?.data?.errors?.length > 0)
      return res.status(400).send({ error: error?.response?.data?.errors[0] });
    if (error?.message) return res.status(400).send({ error: error?.message });
    if (error?.errors?.length > 0 && error?.errors[0])
      return res.status(400).send({ error: error?.errors[0] });
    for (const element in error.errors) {
      return res.status(400).send({ error: error.errors[element]?.message });
    }
    return res.status(400).send({ error });
  } else {
    return res
      .status(500)
      .send({ error: 'Something went wrong please try again later.' });
  }
};


export const chargerStatus = {
  available: 'available',
  preparing: 'preparing',
  charging: 'charging',
  suspended_ev: 'suspended_ev',
  suspended_evse: 'suspended_evse',
  finished: 'finished',
  finishing: 'finishing',
  reserved: 'reserved',
  faulted: 'faulted',
  unavailable: 'unavailable',
  charged: 'charged',
  cancelled: 'cancelled',
  suspended: 'suspended'
}