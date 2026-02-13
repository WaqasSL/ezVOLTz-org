import mongoose, { Schema } from "mongoose";
import { chargerStatus } from "../config/config.js";

const chargerSchema = new Schema(
  {
    idTag: {
      type: String,
      required: true,
      trim: true,
    },
    chargeBoxId: {
      type: String,
      required: true,
      trim: true,
    },
    connectorName: {
      type: String,
      required: true,
      default: null,
      trim: true,
    },
    connectorId: {
      type: String,
      required: true,
      trim: true,
    },
    soapUrl: {
      type: String,
      trim: true,
    },
    startTime: {
      type: Date,
      required: true,
      default: new Date(),
      trim: true,
    },
    status: {
      type: String,
      required: true,
      default: chargerStatus.preparing,
      trim: true,
      enum: [
        chargerStatus.preparing,
        chargerStatus.charging,
        chargerStatus.charged,
        chargerStatus.suspended,
        chargerStatus.faulted,
      ],
    },
    endTime: {
      type: Date,
      default: null,
      trim: true,
    },
    transactionPk: {
      type: Number,
      default: null,
      trim: true,
    },
    vehicleId: {
      type: mongoose.ObjectId,
      required: true,
      ref: "Vehicle",
      trim: true,
    },
    userId: {
      type: mongoose.ObjectId,
      required: true,
      ref: "User",
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Charger", chargerSchema);
