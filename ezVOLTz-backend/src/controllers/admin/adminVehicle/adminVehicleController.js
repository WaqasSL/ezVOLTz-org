import { errorMessage } from '../../../config/config.js';
import Trip from '../../../models/TripModel.js';
import Vehicle from '../../../models/VehicleModel.js';

export const getAllUserVehicles = async (req, res) => {
  const { userId } = req.params;
  try {
    let vehicles = await Vehicle.find({ userId }).populate({
      path: 'make',
      transform: (doc) => (doc === null ? null : doc),
    });

    const vehiclesWithTrips = await Promise.all(
      vehicles.map(async (vehicle) => {
        const tripCount = await Trip.count({ vehicleId: vehicle?._id });
        return {
          ...vehicle._doc,
          make: {
            _id: vehicle?.make?._id,
            name: vehicle?.make?.make,
          },
          model: vehicle?.make?.models?.find(
            (model) => model?._id?.toString() == vehicle?.model?.toString()
          ),
          trips: tripCount,
        };
      })
    );
    res.status(200).send(vehiclesWithTrips);
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getAllVehicles = async (req, res) => {
  try {
    const page = parseInt(req?.query?.page);
    const pageSize = parseInt(req?.query?.pageSize);
    const skipCount = (page - 1) * pageSize;

    let vehiclesData = await Vehicle.find()
      .populate({
        path: 'make',
        transform: (doc) => (doc === null ? null : doc),
      })
      .sort({ createdAt: -1 })
      .skip(skipCount)
      .limit(Number(pageSize));

    const vehiclesCount = await Vehicle.estimatedDocumentCount();

    const vehicles = await Promise.all(
      vehiclesData.map(async (vehicle) => {
        return {
          ...vehicle._doc,
          make: {
            _id: vehicle?.make?._id,
            name: vehicle?.make?.make,
          },
          model: vehicle?.make?.models?.find(
            (model) => model?._id?.toString() == vehicle?.model?.toString()
          ),
          users: await Vehicle.find({
            make: vehicle.make._id,
            model: vehicle?.make?.models?.find(
              (model) => model?._id?.toString() == vehicle?.model?.toString()
            ),
          }).populate({
            path: 'userId',
            select: 'name email',
          }),
        };
      })
    );
    res.status(200).send({ vehicles, count: vehiclesCount });
  } catch (error) {
    errorMessage(res, error);
  }
};
