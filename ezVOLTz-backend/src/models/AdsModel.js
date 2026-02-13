import mongoose, { Schema } from 'mongoose';

const adsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
      default: 'www.ezvoltz.com',
    },
    logos: [
      {
        src: {
          type: String,
          trim: true,
        },
        aspectRatio: {
          type: String,
          trim: true,
        },
      },
    ],
    images: [
      {
        src: {
          type: String,
          trim: true,
        },
        aspectRatio: {
          type: String,
          trim: true,
        },
        type: {
          type: String,
          trim: true,
          enum: ['portrait', 'landscape'],
        },
      },
    ],
    startDateAndTime: {
      type: Date,
      trim: true,
      default: null,
    },
    endDateAndTime: {
      type: Date,
      trim: true,
      default: null,
    },
    active: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Ads', adsSchema);
