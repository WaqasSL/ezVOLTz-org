import mongoose, { Schema } from 'mongoose';

const statsSchema = new Schema(
  {
    androidWeekly: {
      type: Number,
      required: true,
    },
    androidLifetime: {
      type: Number,
      required: true,
    },
    iosWeekly: {
      type: Number,
      required: true,
    },
    iosLifetime: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Stats', statsSchema);
