import { errorMessage } from '../../config/config.js';
import Trip from '../../models/TripModel.js';
import { addTripSchema } from '../../schema/trip/tripSchema.js';

export const getAllTripByUser = async (req, res) => {
  const { userId } = req.params;
  if (userId !== req.userInfo?.userId)
    return res.status(401).send({ error: 'You are not authorized.' });

  try {
    const trips = await Trip.find({ userId });
    res.status(200).send({ trips });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getAllUpcomingTripByUser = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { userId } = req.params;
  if (userId !== req.userInfo?.userId)
    return res.status(401).send({ error: 'You are not authorized.' });

  try {
    const currentDate = new Date();
    const trips = await Trip.find({
      userId,
      status: 'upcoming',
      $or: [
        { startDate: { $gt: currentDate } },
        { startTime: { $gt: currentDate } },
        {
          startDate: { $exists: false },
          startTime: { $exists: false }
        },
        {
          startDate: currentDate,
          startTime: { $exists: false }
        }
      ]
    })
      .sort({ startDate: 1, startTime: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalTrips = await Trip.countDocuments({
      userId,
      status: 'upcoming',
      $or: [
        { startDate: { $gt: currentDate } },
        { startTime: { $gt: currentDate } },
        {
          startDate: { $exists: false },
          startTime: { $exists: false }
        },
        {
          startDate: currentDate,
          startTime: { $exists: false }
        }
      ]
    });

    res.status(200).send({ trips, count: totalTrips });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getAllPreviousTripByUser = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { userId } = req.params;
  if (userId !== req.userInfo?.userId)
    return res.status(401).send({ error: 'You are not authorized.' });

  try {
    const currentDate = new Date();
    const trips = await Trip.find({
      userId,
      $or: [
        { startDate: { $lt: currentDate } },
        { startTime: { $lt: currentDate } },
        {
          startDate: { $exists: true },
          startTime: { $exists: false }
        },
        {
          status: { $ne: 'upcoming' }
        }
      ]
    })
      .sort({ startDate: -1, startTime: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalTrips = await Trip.countDocuments({
      userId,
      $or: [
        { startDate: { $lt: currentDate } },
        { startTime: { $lt: currentDate } },
        {
          startDate: { $exists: true },
          startTime: { $exists: false }
        },
        {
          status: { $ne: 'upcoming' }
        }
      ]
    });

    res.status(200).send({ trips, count: totalTrips });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getAllInProgressTripByUser = async (req, res) => {
  const { userId } = req.params;
  if (userId !== req.userInfo?.userId)
    return res.status(401).send({ error: 'You are not authorized.' });

  try {
    const trip = await Trip.findOne(
      { status: 'inprogress', userId },
      '-__v -userId'
    )
      .populate({
        path: 'vehicleId',
        select: '-__v',
        populate: [{ path: 'make', select: '-__v' }],
      })
      .exec();
    res.status(200).send({ trip });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getSingleTripById = async (req, res) => {
  const { userId, tripId } = req.params;
  if (userId !== req.userInfo?.userId)
    return res.status(401).send({ error: 'You are not authorized.' });
  try {
    const trip = await Trip.findOne({ _id: tripId, userId }, '-__v -userId')
      .populate({
        path: 'vehicleId',
        select: '-__v',
        populate: [{ path: 'make', select: '-__v' }],
      })
      .exec();
    if (trip === null)
      return res.status(404).send('Trip not found against this record.');
    trip.vehicleId.make.models = trip?.vehicleId?.make?.models?.filter(
      (model) => model?._id?.toString() === trip?.vehicleId?.model?.toString()
    );
    res.status(200).send({ trip });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const addTrip = async (req, res) => {
  const { userId } = req.params;
  if (userId !== req.userInfo?.userId)
    return res.status(401).send({ error: 'You are not authorized.' });
  try {
    await addTripSchema.validate(req.body);
    const {
      origin,
      stops,
      destination,
      startDate,
      startTime,
      chargersType,
      connector,
      network,
      distance,
      time,
      speed,
      energy,
      cost,
      vehicleId,
      avoidTolls,
      avoidHighways,
      avoidTraffic,
      hotels,
      restaurants,
      campGround,
      actualStartDateTime,
    } = req.body;
    const trip = await Trip.create({
      origin,
      stops: stops || [],
      destination,
      startDate,
      startTime,
      chargersType,
      connector,
      distance,
      network,
      time,
      speed,
      energy,
      cost,
      vehicleId,
      userId,
      avoidTolls: avoidTolls || false,
      actualStartDateTime: actualStartDateTime || null,
      avoidHighways: avoidHighways || false,
      avoidTraffic: avoidTraffic || false,
      hotels: hotels || false,
      restaurants: restaurants || false,
      campGround: campGround || false,
    });
    res.status(201).send({ message: 'Trip created successfully.', trip });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const updateTripById = async (req, res) => {
  const { userId, tripId } = req.params;
  if (userId !== req.userInfo?.userId)
    return res.status(401).send({ error: 'You are not authorized.' });

  try {
    const trip = await Trip.findOne({ _id: tripId, userId }).exec();
    if (!trip)
      return res
        .status(404)
        .send('Something went wrong please try again later.');
    const updateTrip = await Trip.findByIdAndUpdate(
      tripId,
      {
        ...req.body,
        userId,
      },
      { new: true }
    );
    if (!updateTrip)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again later.' });
    res
      .status(200)
      .send({ message: 'Trip updated successfully.', trip: updateTrip });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const updateTripStatusById = async (req, res) => {
  const { userId, tripId } = req.params;
  if (userId !== req.userInfo?.userId)
    return res.status(401).send({ error: 'You are not authorized.' });

  try {
    const trip = await Trip.findOne({ _id: tripId, userId }).exec();
    if (!trip)
      return res
        .status(404)
        .send('Something went wrong please try again later.');
    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      {
        ...req.body,
        userId,
      },
      { new: true }
    );
    if (!updatedTrip)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again later.' });
    res
      .status(200)
      .send({ message: 'Trip updated successfully.', trip: updatedTrip });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const startTripById = async (req, res) => {
  const { userId, tripId } = req.params;
  if (userId !== req.userInfo?.userId)
    return res.status(401).send({ error: 'You are not authorized.' });
  try {
    const trip = await Trip.findOne({ _id: tripId, userId }).exec();
    if (!trip)
      return res
        .status(404)
        .send('Something went wrong please try again later.');
    if (trip?._doc?.status === 'completed')
      return res.status(400).send({
        error: 'You can not start the trip that has been already completed.',
      });
    const inProgressTrip = await Trip.findOne({
      userId,
      status: 'inprogress',
    }).exec();
    if (inProgressTrip)
      return res
        .status(400)
        .send({ error: 'You can not start more then one trip at same time.' });
    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      {
        status: 'inprogress',
        actualStartDateTime: req.body?.startTime || new Date(),
      },
      { new: true }
    );
    if (!updatedTrip)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again later.' });
    res
      .status(200)
      .send({ message: 'Your trip has been started.', trip: updatedTrip });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const stopTripById = async (req, res) => {
  const { userId, tripId } = req.params;
  if (userId !== req.userInfo?.userId)
    return res.status(401).send({ error: 'You are not authorized.' });

  try {
    const trip = await Trip.findOne({ _id: tripId, userId }).exec();
    if (!trip)
      return res
        .status(404)
        .send('Something went wrong please try again later.');
    if (trip?._doc?.status === 'upcoming')
      return res
        .status(400)
        .send({ error: 'You can not stop the trip that are not started.' });
    if (trip?._doc?.status === 'completed')
      return res
        .status(400)
        .send({ error: 'This trip has been already completed.' });
    if (trip?._doc?.status === 'cancelled')
      return res.status(400).send({ error: 'This trip has been cancelled.' });
    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      {
        status: 'completed',
      },
      { new: true }
    );
    if (!updatedTrip)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again later.' });
    res
      .status(200)
      .send({ message: 'Trip has been completed.', trip: updatedTrip });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const deleteTripById = async (req, res) => {
  const { userId, tripId } = req.params;
  if (userId !== req.userInfo?.userId)
    return res.status(401).send({ error: 'You are not authorized.' });

  try {
    const trip = await Trip.deleteOne({ _id: tripId, userId });
    if (trip?.deletedCount !== 1)
      return res
        .status(500)
        .send('Something went wrong please try again later.');
    res.status(200).send({ message: 'Trip deleted successfully.' });
  } catch (error) {
    errorMessage(res, error);
  }
};
