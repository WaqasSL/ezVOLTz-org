import mongoose, { Schema } from 'mongoose';

const validateEmail = (email) => {
  const matchEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return matchEmail.test(email);
};

const adminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: 'Email address is required',
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
    lastLoginAt: {
      type: Date,
      trim: true,
    },
    logos: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Admin', adminSchema);
