import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      status: {
        type: String,
        required: false,
        trim: true,
      },
      connectorId: {
        type: String,
        required: false,
        trim: true,
      },
      chargeBoxId: {
        type: String,
        required: false,
        trim: true,
      },
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'User',
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Notifications', notificationSchema);
