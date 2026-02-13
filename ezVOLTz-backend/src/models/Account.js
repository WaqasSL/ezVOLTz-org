import mongoose, { Schema } from "mongoose";

const accountSchema = new Schema(
  {
    customerId: { type: String, required: true, trim: true },
    driverId: { type: String, trim: true, default: null },
    idTag: { type: String, trim: true, default: null },
    userId: {
      type: mongoose.ObjectId,
      required: true,
      ref: "User",
      trim: true,
    },
  },
  { timestamps: true }
);

accountSchema.index({ userId: 1 }, { unique: true });
accountSchema.index({ idTag: 1 }, { unique: true, sparse: true });

export default mongoose.model("Account", accountSchema);
