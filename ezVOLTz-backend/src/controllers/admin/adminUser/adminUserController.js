import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { errorMessage, s3Client } from '../../../config/config.js';
import { saasChargeInstanceApi } from '../../../utls/instance/instance.js';
import { updateDriverApi } from '../../saasCharge/saasChargeController.js';
import { registerSchema } from '../../../schema/user/userSchema.js';
import stripe from '../../../config/stripe/stripe.js';
import User from '../../../models/UserModel.js';
import Account from '../../../models/Account.js';
import bcrypt from 'bcryptjs';
import sharp from 'sharp';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import 'dotenv/config.js';
import Vehicle from '../../../models/VehicleModel.js';
import Trip from '../../../models/TripModel.js';
import VehicleModel from '../../../models/VehicleModel.js';
import TripModel from '../../../models/TripModel.js';
import Notifications from '../../../models/Notifications.js';
import TransactionLogModel from '../../../models/TransactionLogModel.js';

const bucketName = process.env.S3_BUCKET_NAME;
// Check if server is in staging environment
const isStaging = process.env.ENVIRONMENT === 'staging';

export const adminGetUserProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ _id: userId }, '-__v -password');
    if (user === null)
      return res.status(404).send({ error: 'User not found.' });
    res.status(200).send({ user });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getAllUsers = async (req, res) => {
  const userId = req?.userInfo?.userId;
  if (!userId)
    return res
      .status(401)
      .send({ error: 'You are not authorized for this request.' });
  try {
    const page = parseInt(req?.query?.page);
    const pageSize = parseInt(req?.query?.pageSize);
    const text = req?.query?.text;
    let startDate = new Date(req?.query?.startDate);
    let endDate = new Date(req?.query?.endDate);

    if (!startDate || isNaN(startDate.getTime())) {
      startDate = new Date(0);
    }
    if (!endDate || isNaN(endDate.getTime())) {
      endDate = new Date();
    }

    const skipCount = (page - 1) * pageSize;
    const usersCount = await User.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      $or: [
        { name: { $regex: text || '', $options: 'i' } },
        { email: { $regex: text || '', $options: 'i' } },
        { phone: { $regex: text || '', $options: 'i' } },
      ],
    });
    const users = await User.find(
      {
        createdAt: { $gte: startDate, $lte: endDate },
        $or: [
          { name: { $regex: text || '', $options: 'i' } },
          { email: { $regex: text || '', $options: 'i' } },
          { phone: { $regex: text || '', $options: 'i' } },
        ],
      },
      '-__v -password -appleRefreshToken -appleUserId -fbUserId -isActive -lastLoginAt -platform -registerMethod'
    )
      .sort({ createdAt: -1 })
      .skip(skipCount)
      .limit(Number(pageSize));

    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        const tripCount = await Trip.countDocuments({ userId: user?._id });
        const vehicleCount = await Vehicle.countDocuments({
          userId: user?._id,
        });
        return {
          ...user?._doc,
          trips: tripCount,
          vehicles: vehicleCount,
        };
      })
    );
    res.status(200).send({ users: usersWithDetails, count: usersCount });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getAllUsersForCSV = async (req, res) => {
  const userId = req?.userInfo?.userId;
  if (!userId)
    return res
      .status(401)
      .send({ error: 'You are not authorized for this request.' });
  try {
    let startDate = new Date(req?.query?.startDate);
    let endDate = new Date(req?.query?.endDate);

    if (!startDate || isNaN(startDate.getTime())) {
      startDate = new Date(0);
    }
    if (!endDate || isNaN(endDate.getTime())) {
      endDate = new Date();
    }

    const users = await User.find(
      {
        createdAt: { $gte: startDate, $lte: endDate },
      },
      'name email phone lastActiveAt lastLoginAt createdAt isRegisterConsent -_id'
    ).sort({ createdAt: -1 });

    res.status(200).send({ users });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const addUser = async (req, res) => {
  try {
    await registerSchema.validate(req.body);
    const userExists = await User.findOne({
      email: req.body?.email,
    }).exec();

    if (userExists && userExists?.isActive)
      return res
        .status(400)
        .send({ error: 'Account already exist with given email.' });
    if (userExists && !userExists?.isActive) {
      const token = jwt.sign(
        {
          user: { userId: userExists?._id, email: userExists?.email },
        },
        process.env.HASH_EMAIL_KEY,
        { expiresIn: '2d' }
      );
      const msg = {
        from: process.env.SENDGRID_ACCOUNT_EMAIL,
        template_id: process.env.SENDGRID_TEM_ID_FOR_VERIFY_EMAIL,
        personalizations: [
          {
            to: { email: `${req.body?.email}` },
            dynamic_template_data: {
              subject: 'Verification Email ✔',
              button_url: `${process.env.CLIENT_URL}verify-account/${token}`,
              name: req.body.name,
            },
          },
        ],
      };
      sgMail
        .send(msg)
        .then(() => {
          res.status(200).send({
            message: 'Verification email is sent. Please verify your email.',
          });
        })
        .catch((error) => {
          res.status(401).send({ error: error });
        });
    } else {
      const salt = await bcrypt.genSalt(5);
      const password = await bcrypt.hash(req?.body?.password, salt);
      let user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: password,
        platform: req.body.platform,
        registerMethod: req.body.registerMethod,
        country: req.body.country,
        city: req.body.city || '',
        state: req?.body?.state || '',
        zipCode: req?.body?.zipCode || '',
        phone: req?.body?.phone || '',
        isActive: false,
        lastLoginAt: null,
        profileImage: '',
        fbUserId: '',
      });
      if (!user)
        return res
          .status(404)
          .send({ error: 'Something went wrong please try again later.' });
      const token = jwt.sign(
        {
          user: { userId: user?._id, email: user?.email },
        },
        process.env.HASH_EMAIL_KEY,
        { expiresIn: '2d' }
      );
      const msg = {
        from: process.env.SENDGRID_ACCOUNT_EMAIL,
        template_id: process.env.SENDGRID_TEM_ID_FOR_VERIFY_EMAIL,
        personalizations: [
          {
            to: { email: `${req.body?.email}` },
            dynamic_template_data: {
              subject: 'Verification Email ✔',
              button_url: `${process.env.CLIENT_URL}verify-account/${token}`,
              name: req.body.name,
            },
          },
        ],
      };
      sgMail
        .send(msg)
        .then(() => {
          res.status(200).send({
            message: 'Verification email is sent. Please verify email.',
          });
        })
        .catch((error) => {
          res.status(401).send({ error: error });
        });
    }
  } catch (error) {
    errorMessage(res, error);
  }
};

export const adminUpdateUserProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const { name, country, city, zipCode, state, phone } = req.body;
    const user = await User.findOne({ _id: userId });
    if (user === null)
      return res.status(404).send({ error: 'User not found.' });

    const updatedUser = await User.findByIdAndUpdate(userId, {
      name,
      country,
      state,
      city,
      zipCode,
    });

    if (!updatedUser)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again later.' });
    res.status(200).send({ message: 'Profile updated successfully.' });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const adminUploadUserImage = async (req, res) => {
  const { userId } = req.params;
  //Check the file
  if (req.file) {
    // Check the MIME type (allow any image MIME type)
    if (!req.file.mimetype.startsWith('image/'))
      return res
        .status(400)
        .send({ error: 'File type not supported. Please upload an image.' });

    if (req.file.size > 10485760)
      return res
        .status(400)
        .send({ error: 'File size too large. Maximum size should be 10MB.' });
  }

  try {
    const user = await User.findOne({ _id: userId });
    if (user === null)
      return res.status(404).send({ error: 'User not found.' });
    if (user?.profileImage) {
      const commandDel = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: `${
          user?.profileImage?.split(`${process.env.S3_BUCKET_ACCESS_URL}`)[1]
        }`,
      });
      await s3Client.send(commandDel);
    }
    const fileName = crypto.randomBytes(32).toString('hex');
    const buffer = await sharp(req.file.buffer)
      .resize({
        width: 520,
        height: 520,
        fit: 'contain',
      })
      .toBuffer();
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: `profile/${fileName}`,
      Body: buffer,
      ContentType: req.file.mimetype,
    });
    await s3Client.send(command);
    const updatedUser = await User.findByIdAndUpdate(userId, {
      profileImage: `${process.env.S3_BUCKET_ACCESS_URL}profile/${fileName}`,
    });
    if (!updatedUser)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again later.' });
    res.status(200).send({
      message: 'Image has been uploaded.',
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req?.params;
  if (!userId)
    return res
      .status(401)
      .send({ error: 'You are not authorized for this request.' });
  try {
    const user = await User.findOne({ _id: userId });
    if (!user)
      return res.status(401).send({ error: 'Your account does not exist.' });
    const account = await Account.findOne({ userId });
    if (account?.customerId) {
      await stripe.customers.del(account?.customerId);
      Account.findByIdAndUpdate(account?._id, { customerId: null });
    }
    if (account?.driverId) {
      await saasChargeInstanceApi
        .delete(`/external/driver?driverId=${account?.driverId}`)
        .catch(async () => {
          await updateDriverApi({
            ...user?._doc,
            driverId: account?.driverId,
            email: `${account?.driverId}@gmail.com`,
          });
          Account.findByIdAndUpdate(account?._id, { driverId: null });
        });
      Account.findByIdAndUpdate(account?._id, { driverId: null });
    }
    const commandDel = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: `${
        user?.profileImage?.split(`${process.env.S3_BUCKET_ACCESS_URL}`)[1]
      }`,
    });
    await s3Client.send(commandDel);
    await TripModel.deleteMany({ userId });
    await VehicleModel.deleteMany({ userId });
    if (isStaging) {
      await Notifications.deleteMany({ user: userId });
      await TransactionLogModel.deleteMany({ user: userId });
    }
    const deleted = await User.deleteOne({
      _id: userId,
    });
    if (deleted?.deletedCount !== 1)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again later.' });
    res.status(200).send({ message: 'Account has been deleted.' });
  } catch (error) {
    errorMessage(res, error);
  }
};
