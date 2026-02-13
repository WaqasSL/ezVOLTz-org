import mongoose, { Schema } from 'mongoose';

const feedbackSchema = new Schema(
  {
    images: {
      type: [String],
      default: [],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Feedback', feedbackSchema);
