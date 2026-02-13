import { errorMessage } from '../../../config/config.js';
import Trip from '../../../models/TripModel.js';
// import { addTripSchema } from '../../schema/trip/tripSchema.js';

export const getAllTrips = async (req, res) => {
  try {
    const page = parseInt(req?.query?.page);
    const pageSize = parseInt(req?.query?.pageSize);
    const skipCount = (page - 1) * pageSize;
    const tripCount = await Trip.estimatedDocumentCount();
    const trips = await Trip.find({})
      .sort({ _id: -1 })
      .skip(skipCount)
      .limit(Number(pageSize));
    res.status(200).send({ trips, count: tripCount });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getTripDetail = async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findOne({ _id: tripId }, '-__v')
    .populate({
      path: 'vehicleId',
      select: '-__v',
      populate: [{ path: 'make', select: '-__v' }],
    })
    .populate('userId', 'name email')
    .exec();
    if(!trip) return res.status(404).send({ message: 'Trip not found' })
    res.status(200).send({ trip });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getAllUserTrips = async (req, res) => {
  const { userId } = req.params;
  try {
    const trips = await Trip.find({ userId });
    res.status(200).send({ trips });
  } catch (error) {
    errorMessage(res, error);
  }
};