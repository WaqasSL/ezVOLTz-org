import mongoose, { Schema } from 'mongoose';

const repliesSchema = new Schema(
  {
    comment: {
      type: String,
      trim: true,
      default: '',
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
    reviewId: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'Review',
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

export default mongoose.model('Reply', repliesSchema);
