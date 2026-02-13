import mongoose, { Schema } from 'mongoose';

const tripSchema = new Schema(
  {
    origin: {
      text: {
        type: String,
        required: true,
        trim: true,
      },
      latitude: {
        type: Number,
        required: true,
        trim: true,
      },
      longitude: {
        type: Number,
        required: true,
        trim: true,
      },
    },
    stops: {
      type: [
        {
          name: { type: String },
          type: { type: String, enum: ['stop', 'waypoint'] },
        },
      ],
      default: [],
    },
    destination: {
      text: {
        type: String,
        required: true,
        trim: true,
      },
      latitude: {
        type: Number,
        required: true,
        trim: true,
      },
      longitude: {
        type: Number,
        required: true,
        trim: true,
      },
    },
    startDate: {
      type: Date,
      trim: true,
      default: null,
    },
    startTime: {
      type: Date,
      trim: true,
      default: null,
    },
    actualStartDateTime: {
      type: Date,
      trim: true,
    },
    avoidTolls: {
      type: Boolean,
      default: false,
    },
    avoidTraffic: {
      type: Boolean,
      default: false,
    },
    avoidHighways: {
      type: Boolean,
      default: false,
    },
    hotels: {
      type: Boolean,
      default: false,
    },
    restaurants: {
      type: Boolean,
      default: false,
    },
    campGround: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: 'upcoming',
      enum: ['completed', 'cancelled', 'inprogress', 'upcoming'],
    },
    chargersType: {
      type: String,
      required: true,
      trim: true,
    },
    connector: {
      type: String,
      required: true,
      trim: true,
    },
    network: {
      type: String,
      required: true,
      trim: true,
    },
    distance: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    speed: {
      type: String,
      required: true,
      trim: true,
    },
    energy: {
      type: String,
      required: true,
      trim: true,
    },
    cost: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleId: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'Vehicle',
      trim: true,
    },
    userId: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'User',
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Trip', tripSchema);
