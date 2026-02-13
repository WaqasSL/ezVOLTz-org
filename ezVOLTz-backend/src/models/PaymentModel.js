import mongoose, { Schema } from 'mongoose';

const paymentSchema = new Schema(
  {
    customerId: { type: String, required: true, trim: true },
    clientSecret: { type: String, required: true, trim: true },
    userId: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'User',
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
