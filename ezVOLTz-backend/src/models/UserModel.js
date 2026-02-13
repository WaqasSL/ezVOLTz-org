import mongoose, { Schema } from 'mongoose';
import Trip from './TripModel.js';
import Vehicle from './VehicleModel.js';
import Account from './Account.js';
import Charger from './ChargerModel.js';
import Review from './ReviewModel.js';
import Reply from './ReplyModel.js';

const validateEmail = (email) => {
  const matchEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return matchEmail.test(email);
};

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: 'Email address is required',
      validate: {
        validator: function (v, cb) {
          User.find({ name: v }, function (err, docs) {
            cb(docs.length == 0);
          });
        },
        message: 'Email already in use!',
      },
      validate: [validateEmail, 'Please fill a valid email address'],
      immutable: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    platform: {
      type: String,
      enum: ['web', 'android', 'ios'],
    },
    fbUserId: {
      type: String,
      default: null,
      trim: true,
    },
    appleRefreshToken: {
      type: String,
      default: null,
      trim: true,
    },
    appleUserId: {
      type: String,
      default: null,
      trim: true,
    },
    registerMethod: {
      type: String,
      enum: ['google', 'facebook', 'email', 'apple'],
    },
    country: {
      type: String,
      trim: true,
      default: 'United States',
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      default: 'Washington, D.C.',
    },
    zipCode: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      defaultValue: false,
    },
    lastLoginAt: {
      type: Date,
      trim: true,
    },
    firebaseTokens: [
      {
        platform: {
          type: String,
          trim: true,
          enum: [
            'android',
            'ios',
            'chrome',
            'safari',
            'firefox',
            'opera',
            'edge',
            'other',
          ],
        },
        token: {
          type: String,
          trim: true,
        },
      },
    ],
    lastActiveAt: {
      type: Date,
      trim: true,
      default: null,
    },
    isRegisterConsent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre('deleteOne', async function (next) {
  const { _id } = this.getQuery();
  await Vehicle.deleteMany({ userId: _id });
  await Trip.deleteMany({ userId: _id });
  await Account.deleteMany({ userId: _id });
  await Charger.deleteMany({ userId: _id });
  await Review.deleteMany({ user: { userId: _id } });
  await Reply.deleteMany({ user: { userId: _id } });
  next();
});

export default mongoose.model('User', userSchema);
