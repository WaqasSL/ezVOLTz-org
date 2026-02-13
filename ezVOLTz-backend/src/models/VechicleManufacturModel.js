import mongoose, { Schema } from 'mongoose';

const vehicleManufacture = new Schema(
  {
    make: {
      type: String,
      required: true,
      unique: true,
      trime: true,
    },
    models: [
      {
        batteryCapacity: {
          type: Number,
          trim: true,
          default: null,
        },
        model: {
          type: String,
          trim: true,
          default: null,
        },
        range: {
          type: Number,
          trim: true,
          default: null,
        },
        topSpeed: {
          type: String,
          trim: true,
          default: null,
        },
        acceleration: {
          type: String,
          trim: true,
          default: null,
        },
        efficienty: {
          type: String,
          trim: true,
          default: null,
        },
        fastCharge: {
          type: String,
          trim: true,
          default: null,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('VehicleManufacture', vehicleManufacture);
