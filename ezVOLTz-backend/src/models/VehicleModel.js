import mongoose, { Schema } from 'mongoose';
import Charger from './ChargerModel.js';
import Trip from './TripModel.js';

const vehicleSchema = new Schema(
  {
    picture: {
      type: String,
      default: null,
    },
    make: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'VehicleManufacture',
    },
    model: {
      type: mongoose.ObjectId,
      required: true,
    },
    range: {
      type: Number,
      require: true,
    },
    userId: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

vehicleSchema.pre('deleteOne', async function (next) {
  const { userId, _id: vehicleId } = this.getQuery();

  await Trip.deleteMany({ userId, vehicleId });
  await Charger.deleteMany({ userId, vehicleId });
});

export default mongoose.model('Vehicle', vehicleSchema);
