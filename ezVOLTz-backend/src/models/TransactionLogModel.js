import mongoose, { Schema } from 'mongoose';

const transactionLogSchema = new Schema(
  {
    driverId: {
      type: String,
      required: true,
      trim: true,
    },
    transactionPk: {
      type: Number,
      required: true,
      trim: true,
    },
    startTransactionTs: {
      type: String,
      required: true,
      trim: true,
    },
    endTransactionTs: {
      type: String,
      default: null,
      trim: true,
    },
    meterValueStart: {
      type: String,
      default: null,
      trim: true,
    },
    meterValueStop: {
      type: String,
      default: null,
      trim: true,
    },
    paymentId: {
      type: String,
      default: null,
      trim: true,
    },
    totalPrice: {
      type: Number,
      default: null,
      trim: true,
    },
    priceDetails: {
      pricePerKwh: {
        type: Number,
        default: null,
        trim: true,
      },
      pricePerMinute: {
        type: Number,
        default: null,
        trim: true,
      },
      priceFlatFee: {
        type: Number,
        default: null,
        trim: true,
      },
      pricePercentFee: {
        type: Number,
        default: null,
        trim: true,
      },
      vatIncluded: {
        type: Boolean,
        default: false,
        trim: true,
      },
    },
    kwhConsumed: {
      type: Number,
      default: null,
      trim: true,
    },
    user: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'User',
      trim: true,
    },
    vehicle: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'Vehicle',
      trim: true,
    },
    charger: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'Charger',
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('TransactionLog', transactionLogSchema);
