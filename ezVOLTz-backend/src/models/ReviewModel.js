import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema(
  {
    stationId: {
      type: String,
      required: true,
      trim: true,
    },
    stationType: {
      type: String,
      required: true,
      trim: true,
      enum: ['nrel', 'saascharge', 'rv'],
    },
    rating: {
      type: Number,
      required: true,
      trim: true,
      default: 0,
      min: 0,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      default: '',
    },
    images: {
      type: [String],
      trim: true,
      default: [],
    },
    like: {
      type: [mongoose.ObjectId],
      default: [],
      ref: 'User',
      trim: true,
    },
    dislike: {
      type: [mongoose.ObjectId],
      default: [],
      ref: 'User',
      trim: true,
    },
    user: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      profileImage: {
        type: String,
        trim: true,
      },
      userId: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'User',
        trim: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
