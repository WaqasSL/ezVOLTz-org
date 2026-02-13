import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import bcrypt from 'bcryptjs';
import sharp from 'sharp';
import crypto from 'crypto';
import twilio from 'twilio';
import { errorMessage, s3Client } from '../../config/config.js';
import User from '../../models/UserModel.js';
import 'dotenv/config.js';
import { verifyPhoneCode } from '../../schema/user/userSchema.js';
import Account from '../../models/Account.js';
import stripe from '../../config/stripe/stripe.js';
import { saasChargeInstanceApi } from '../../utls/instance/instance.js';
import {
  getDriverByEmailApi,
  updateDriverApi,
} from '../saasCharge/saasChargeController.js';
import { createAndSendNotification } from '../../service/notificationService/notification.js';
// import {
//   subscribeUser,
//   unsubscribeUser,
// } from '../../service/mailchimpService/mailchimp.js';

//Twillio
const accountSid = process.env.TW_ACCOUNT_SID;
const authToken = process.env.TW_AUTH_TOKEN;
const verifySid = process.env.TW_VERIFY_SID;
const client = twilio(accountSid, authToken);
// Check if server is in staging environment
const isStaging = process.env.ENVIRONMENT === 'staging';

const bucketName = process.env.S3_BUCKET_NAME;

export const getUserOwnProfile = async (req, res) => {
  const userInfo = req.userInfo;
  try {
    const user = await User.findOne({
      _id: userInfo?.userId,
      email: userInfo?.email,
    });
    if (user === null)
      return res.status(404).send({ error: 'User not found.' });
    res.status(200).send({ user });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const userProfileUpdate = async (req, res) => {
  const { userId } = req.params;
  if (userId !== req?.userInfo?.userId)
    return res
      .status(401)
      .send({ error: 'You are not authorized for this request.' });
  try {
    const { name, country, city, zipCode, state, isRegisterConsent } = req.body;
    const user = await User.findOne({ _id: userId });
    if (user === null)
      return res.status(404).send({ error: 'User not found.' });

    const updatedUser = await User.findByIdAndUpdate(userId, {
      name,
      country,
      state,
      city,
      zipCode,
      isRegisterConsent,
    });

    await createAndSendNotification({
      userId,
      title: 'Profile Updated',
      message: 'Your profile has been updated successfully.',
      url: '/profile&/MyProfile',
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

export const userToggleEmailSubscription = async (req, res) => {
  const { userId } = req.params;
  const { isRegisterConsent } = req.body;
  if (userId !== req?.userInfo?.userId)
    return res
      .status(401)
      .send({ error: 'You are not authorized for this request.' });
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).send({ error: 'User not found.' });

    // let userEmailUnsub;
    // if (isRegisterConsent) userEmailUnsub = await subscribeUser(user);
    // if (!isRegisterConsent) userEmailUnsub = await unsubscribeUser(user);

    const updatedUser = await User.findByIdAndUpdate(userId, {
      isRegisterConsent,
    });

    if (!updatedUser)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again later.' });

    res.status(200).send({
      message: `${
        user?.isRegisterConsent ? 'Unsubscribed' : 'Subscribed'
      } successfully.`,
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const updateFirebaseToken = async (req, res) => {
  const { token, platform } = req.body;
  try {
    const user = await User.findById(req?.userInfo?.userId);
    if (!user) return res.status(404).send({ error: 'User not found.' });

    const updatedUser = await User.findByIdAndUpdate(
      req?.userInfo?.userId,
      {
        firebaseTokens: [
          ...user?.firebaseTokens.filter((t) => t.platform !== platform),
          { token, platform },
        ],
      },
      { new: true }
    );

    if (!updatedUser)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again later.' });
    res.status(200).send({ message: 'Token updated successfully.' });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const userPasswordUpdate = async (req, res) => {
  const { userId } = req.params;
  if (userId !== req?.userInfo?.userId)
    return res
      .status(401)
      .send({ error: 'You are not authorized for this request.' });
  try {
    const { password, oldPassword } = req.body;
    if (!password || password?.length < 7 || password?.length > 16)
      return res.status(400).send({
        error: 'Password should be atleast 8 and maximun 16 characters.',
      });
    if (password === oldPassword)
      return res.status(400).send({
        error: 'You can not set the previous password as the new password.',
      });
    const user = await User.findOne({ _id: userId });
    if (user === null)
      return res.status(404).send({ error: 'User not found.' });
    if (oldPassword) {
      const checkPassword = await bcrypt.compare(oldPassword, user?.password);
      if (!checkPassword)
        return res
          .status(400)
          .send({ error: 'Current password must be the valid one.' });
    }
    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(req?.body?.password, salt);
    const updatedUser = await User.findByIdAndUpdate(userId, {
      password: hashPassword,
    });

    if (!updatedUser)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again later.' });
    res.status(200).send({ message: 'Password updated successfully.' });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const uploadProfileUserImage = async (req, res) => {
  const { userId } = req.params;
  if (userId !== req?.userInfo?.userId)
    return res
      .status(401)
      .send({ error: 'You are not authorized for this request.' });

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

export const deleteUserOwnProfile = async (req, res) => {
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
    const deleted = await User.deleteOne({
      _id: userId,
    });
    if (deleted?.deletedCount !== 1)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again later.' });
    res.status(200).send({ message: 'Your account has been deleted.' });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const sendOTP = async (req, res) => {
  const { userId } = req.params;
  const { phone } = req.body;
  if (!userId)
    return res
      .status(401)
      .send({ error: 'You are not authorized for this request.' });
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).send({ error: 'User not found.' });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        phone,
      },
      { new: true }
    );
    if (!updatedUser)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again later.' });
    client.verify.v2
      .services(verifySid)
      .verifications.create({ to: phone, channel: 'sms' })
      .then((verification) => {
        res.send({
          message: 'Verification code sent through SMS.',
        });
      })
      .catch((error) => {
        errorMessage(res, error);
      });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const verifyOTP = async (req, res) => {
  try {
    await verifyPhoneCode.validate(req.body);
    const { phone, otpCode } = req.body;
    const { userId } = req.params;
    if (!userId)
      return res
        .status(401)
        .send({ error: 'You are not authorized for this request.' });
    const user = await User.findOne({ _id: userId });
    if (user === null)
      return res.status(404).send({ error: 'User not found.' });
    client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phone, code: otpCode })
      .then((verification_check) => verification_check)
      .then(async (verify) => {
        if (!verify?.valid)
          return res.status(400).send({ error: 'OTP code is invalid.' });
        const updatedUser = await User.findByIdAndUpdate(userId, {
          phone: phone,
        });
        if (!updatedUser)
          return res
            .status(500)
            .send({ error: 'Something went wrong please try again later.' });
        if (isStaging) {
          const driverExist = await getDriverByEmailApi({ email: user?.email });
          if (driverExist) {
            await updateDriverApi({
              userInfo: { ...updatedUser?._doc },
              driverInfo: driverExist,
            });
          }
        }
        res.status(200).send({
          message: 'Phone number is verified and has been updated.',
        });
      })
      .catch((error) => errorMessage(res, error));
  } catch (error) {
    errorMessage(res, error);
  }
};
