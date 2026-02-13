import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { object, string } from 'yup';
import axios from 'axios';
import { errorMessage, s3Client } from '../../config/config.js';
import User from '../../models/UserModel.js';
import {
  loginSchema,
  registerSchema,
  resendVerifySchema,
  socialRegisterSchema,
} from '../../schema/user/userSchema.js';
import { createDriver } from '../saasCharge/saasChargeController.js';
import Account from '../../models/Account.js';
import stripe from '../../config/stripe/stripe.js';
import Admin from '../../models/AdminModel.js';

const bucketName = process.env.S3_BUCKET_NAME;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const registerUser = async (req, res) => {
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
            message: 'Verification email sent. Please verify your email.',
          });
        })
        .catch((error) => {
          res.status(401).send({ error: error });
        });
    } else {
      const salt = await bcrypt.genSalt(5);
      const password = await bcrypt.hash(req?.body?.password, salt);
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: password,
        platform: req.body.platform,
        registerMethod: req.body.registerMethod,
        country: req.body.country,
        city: req.body.city || '',
        state: req?.body?.state || '',
        zipCode: req?.body?.zipCode || '',
        phone: req?.body?.phone || null,
        isActive: false,
        lastLoginAt: null,
        profileImage: '',
        fbUserId: '',
        isRegisterConsent: req.body.isRegisterConsent,
      };

      let user = await User.create(newUser);
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
            message: 'Verification email sent. Please verify your email.',
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

export const socialAccountLogin = async (req, res) => {
  try {
    const currentLoginDate = new Date();
    await socialRegisterSchema.validate(req.body);
    let user;
    if (req.body.registerMethod === 'facebook' && !req.body?.email) {
      if (!req.body?.fbUserId)
        return res.status(400).send({ error: 'Facebook user id is required.' });
      user = await User.findOne({
        fbUserId: req.body?.fbUserId,
      });
      if (!user && !req.body?.email)
        return res.status(203).send({
          error: 'Following information is required.',
          isEmailRequired: true,
          isNameRequired: !req.body?.name,
          name: req.body?.name,
          email: req.body?.email || '',
          fbUserId: req.body?.fbUserId,
          profileImage: req.body?.profileImage,
          registerMethod: req.body?.registerMethod,
        });
    } else {
      if (!req.body?.email)
        return res.status(203).send({
          error: 'Following information is required.',
          isEmailRequired: true,
          isNameRequired: !req.body?.name,
          name: req.body?.name,
          email: req.body?.email || '',
          fbUserId: req.body?.fbUserId,
          profileImage: req.body?.profileImage,
          registerMethod: req.body?.registerMethod,
        });
      user = await User.findOne({
        email: req.body?.email,
      });
      if (req.body.registerMethod === 'facebook' && req.body?.fbUserId)
        user = await User.findByIdAndUpdate(user?._doc?._id, {
          fbUserId: req.body?.fbUserId,
        });
    }
    let accessToken;
    let refreshToken;
    if (user) {
      const sessionUser = {
        userId: user?.id,
        email: user?.email,
        registerMethod: user?.registerMethod,
      };
      req.session.userInfo = sessionUser;
      accessToken = jwt.sign(
        { user: sessionUser },
        process.env.HASH_ACCESS_KEY,
        { expiresIn: '7d', algorithm: 'HS512' }
      );
      refreshToken = jwt.sign(
        { user: sessionUser },
        process.env.HASH_SECRET_KEY,
        { expiresIn: '30d', algorithm: 'HS512' }
      );
    } else {
      let fileName = null;
      if (req.body?.profileImage) {
        fileName = crypto.randomBytes(32).toString('hex');
        const response = await axios.get(req.body?.profileImage, {
          responseType: 'arraybuffer',
        });
        const buffer = Buffer.from(response.data, 'utf-8');
        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: `profile/${fileName}`,
          Body: buffer,
        });
        s3Client.send(command);
      }
      const newUser = {
        isActive: true,
        name: req.body.name,
        email: req.body.email,
        profileImage: fileName
          ? `${process.env.S3_BUCKET_ACCESS_URL}profile/${fileName}`
          : null,
        password: '',
        fbUserId: req.body?.fbUserId || '',
        platform: req.body?.platform,
        phone: req.body?.phone || null,
        registerMethod: req.body?.registerMethod,
        country: 'United States',
        city: 'Washington, D.C.',
        state: '',
        zipCode: '',
        isActive: true,
        lastLoginAt: currentLoginDate,
        lastActiveAt: currentLoginDate,
        isRegisterConsent: true,
      };
      user = await User.create(newUser);
      if (!user)
        return res
          .status(404)
          .send({ error: 'Something went wrong please try again later.' });
      // const subResponse = await addAndSubscribeUser(newUser);
      const customer = await stripe.customers.create({
        name: user?.name,
        email: user?.email,
        description: 'My Test Customer For ezVOLTZ',
      });
      const account = await Account.create({
        userId: user?._id,
        customerId: customer?.id,
      });
      createDriver({ userId: user?._id });
      const sessionUser = {
        userId: user?._id,
        email: user?.email,
      };
      req.session.userInfo = sessionUser;
      accessToken = jwt.sign(
        { user: sessionUser },
        process.env.HASH_ACCESS_KEY,
        { expiresIn: '7d', algorithm: 'HS512' }
      );
      refreshToken = jwt.sign(
        { user: sessionUser },
        process.env.HASH_SECRET_KEY,
        { expiresIn: '30d', algorithm: 'HS512' }
      );
    }
    res.status(200).send({
      user: {
        ...user?._doc,
        lastLoginAt: currentLoginDate,
        lastActiveAt: currentLoginDate,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const currentLoginDate = new Date();
    await loginSchema.validate(req.body);
    const user = await User.findOne({ email: req.body?.email });
    if (!user)
      return res
        .status(401)
        .send({ error: 'Account not found. Please sign up to get started.' });
    if (user && !user.isActive) {
      const token = jwt.sign(
        {
          user: { userId: user?._id, email: user?.email, role: 'user' },
        },
        process.env.HASH_EMAIL_KEY,
        { expiresIn: '2d' }
      );
      const msg = {
        from: process.env.SENDGRID_ACCOUNT_EMAIL,
        template_id: process.env.SENDGRID_TEM_ID_FOR_VERIFY_EMAIL,
        personalizations: [
          {
            to: { email: `${user?.email}` },
            dynamic_template_data: {
              subject: 'Verification Email ✔',
              button_url: `${process.env.CLIENT_URL}verify-account/${token}`,
              name: user?.name,
            },
          },
        ],
      };
      sgMail
        .send(msg)
        .then(() => {
          res.status(200).send({
            isEmailSent: true,
            message:
              'Your account is not verified. Please verify your email first.',
          });
        })
        .catch((error) => {
          res.status(401).send({ error: error });
        });
    } else {
      const password = await bcrypt.compare(
        req?.body?.password,
        user?.password
      );
      if (!password)
        return res.status(401).send({ error: 'Password is incorrect.' });
      const sessionUser = {
        userId: user?._id,
        email: user?.email,
        role: 'user',
      };
      req.session.userInfo = sessionUser;
      const accessToken = jwt.sign(
        { user: sessionUser },
        process.env.HASH_ACCESS_KEY,
        { expiresIn: '7d', algorithm: 'HS512' }
      );
      const refreshToken = jwt.sign(
        { user: sessionUser },
        process.env.HASH_SECRET_KEY,
        { expiresIn: '30d', algorithm: 'HS512' }
      );
      User.findByIdAndUpdate(user?._id, {
        lastLoginAt: currentLoginDate,
        lastActiveAt: currentLoginDate,
      });
      res.status(200).send({
        user: { ...user?._doc, lastLoginAt: currentLoginDate },
        accessToken,
        refreshToken,
      });
    }
  } catch (error) {
    errorMessage(res, error);
  }
};

export const adminLogin = async (req, res) => {
  try {
    const currentLoginDate = new Date();
    await loginSchema.validate(req.body);
    const user = await Admin.findOne({ email: req?.body?.email });
    if (!user)
      return res.status(401).send({ error: 'Email or Password is not valid.' });
    const password = await bcrypt.compare(req?.body?.password, user?.password);
    if (!password)
      return res.status(401).send({ error: 'Email or Password is not valid.' });
    const sessionUser = {
      userId: user?._id,
      email: user?.email,
      role: 'admin',
    };
    req.session.userInfo = sessionUser;
    const accessToken = jwt.sign(
      { user: sessionUser },
      process.env.HASH_ACCESS_KEY,
      { expiresIn: '7d', algorithm: 'HS512' }
    );
    const refreshToken = jwt.sign(
      { user: sessionUser },
      process.env.HASH_SECRET_KEY,
      { expiresIn: '30d', algorithm: 'HS512' }
    );
    User.findByIdAndUpdate(user?._id, {
      lastLoginAt: currentLoginDate,
      lastActiveAt: currentLoginDate,
    });
    res.status(200).send({
      user: { ...user?._doc, lastLoginAt: currentLoginDate },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const verifyUser = async (req, res) => {
  const { token } = req?.params;
  try {
    const { user } = jwt.verify(token, process.env.HASH_EMAIL_KEY);
    if (!user?.email || !user?.userId)
      return res.status(401).send({ error: 'Token is not valid.' });
    const userExists = await User.findOne({
      _id: user?.userId,
      email: user?.email,
    }).exec();
    if (userExists?.isActive)
      return res.status(400).send({ error: 'Email address already verified.' });
    const updatedUser = await User.findByIdAndUpdate(user?.userId, {
      isActive: true,
    });
    if (!updatedUser)
      return res
        .status(404)
        .send({ error: 'Something went wrong please try again later.' });
    const customer = await stripe.customers.create({
      name: userExists?._doc?.name,
      email: userExists?._doc?.email,
      description: 'My Customer For ezVOLTZ',
    });
    await Account.create({
      userId: user?.userId,
      customerId: customer?.id,
    });
    await createDriver({ userId: user?.userId });
    res.status(200).send({
      message: 'Thank you for verifying your email.',
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const generaterefreshToken = async (req, res) => {
  const { refreshToken } = req?.params;
  try {
    const { user } = jwt.verify(refreshToken, process.env.HASH_SECRET_KEY);
    if (!user?.email || !user?.userId)
      return res.status(401).send({ error: 'Token is not valid.' });
    const userInfo = await User.findOne({
      email: user?.email,
      _id: user?.userId,
    }).exec();
    const newAccessToken = jwt.sign(
      {
        user: { userId: userInfo?.id, email: userInfo?.email },
      },
      process.env.HASH_ACCESS_KEY,
      { expiresIn: '7d', algorithm: 'HS512' }
    );
    const newrefreshToken = jwt.sign(
      {
        user: { userId: userInfo?._id, email: userInfo?.email },
      },
      process.env.HASH_SECRET_KEY,
      { expiresIn: '30d', algorithm: 'HS512' }
    );
    res.status(200).send({
      accessToken: newAccessToken,
      refreshToken: newrefreshToken,
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const resendVerifyEmail = async (req, res) => {
  try {
    await resendVerifySchema.validate(req.body);
    const user = await User.findOne({ email: req.body?.email }).exec();
    if (!user)
      return res
        .status(404)
        .send({ error: 'User does not exist with this email.' });
    const token = jwt.sign(
      {
        user: { userId: user?.id, email: user?.email },
      },
      process.env.HASH_EMAIL_KEY,
      { expiresIn: '2d' }
    );
    const msg = {
      from: process.env.SENDGRID_ACCOUNT_EMAIL,
      template_id: process.env.SENDGRID_TEM_ID_FOR_VERIFY_EMAIL,
      personalizations: [
        {
          to: { email: `${user.email}` },
          dynamic_template_data: {
            subject: 'Verification Email ✔',
            button_url: `${process.env.CLIENT_URL}verify-account/${token}`,
          },
        },
      ],
    };
    sgMail
      .send(msg)
      .then(() => {
        res.status(200).send({
          message: 'Verification email sent. Please verify your email address.',
        });
      })
      .catch((error) => {
        res.status(401).send({ error: error });
      });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    await resendVerifySchema.validate(req.body);
    const user = await User.findOne({ email: req.body?.email }).exec();
    if (user === null)
      return res
        .status(404)
        .send({ error: 'User does not exist with this email.' });
    const token = jwt.sign(
      {
        user: {
          userId: user?._id,
          email: user?.email,
          password: user?.password,
        },
      },
      process.env.HASH_FORGOT_PASSWORD_KEY,
      { expiresIn: '1d' }
    );
    const msg = {
      from: process.env.SENDGRID_ACCOUNT_EMAIL,
      template_id: process.env.SENDGRID_TEM_ID_FOR_FORGOT_PASSWORD,
      personalizations: [
        {
          to: { email: `${user.email}` },
          dynamic_template_data: {
            subject: 'Forgot Password Email',
            button_url: `${process.env.CLIENT_URL}new-password/${token}`,
          },
        },
      ],
    };
    sgMail
      .send(msg)
      .then(() => {
        res.status(200).send({
          message: 'Forgot Password Email sent. Please check your email.',
        });
      })
      .catch((error) => {
        res.status(401).send({ error: error });
      });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const checkUserAndLoggedIsSame = async (req, res) => {
  const { token } = req.params;
  const { userEmail } = req?.body;
  try {
    const { user } = jwt.verify(token, process.env.HASH_FORGOT_PASSWORD_KEY);
    if (!user?.userId || !user?.email)
      return res.status(401).send({ error: 'Token is not valid.' });
    const userData = await User.findOne({
      email: user?.email,
      _id: user?.userId,
    }).exec();
    if (!userData)
      return res.status(404).send({ error: 'User account does not exist.' });
    if (userData?.email !== userEmail)
      return res.status(200).send({ isSame: false });
    return res.status(200).send({ isSame: true });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const setNewPassword = async (req, res) => {
  const { token } = req.params;
  if (!token) return res.status(401).send({ error: 'Token is not valid.' });
  try {
    await object({
      password: string().required('Password is required.').min(8).max(16),
    }).validate(req.body);
    const { user } = jwt.verify(token, process.env.HASH_FORGOT_PASSWORD_KEY);
    if (!user?.userId || !user?.email)
      return res.status(401).send({ error: 'Token is not valid.' });
    const userData = await User.findOne({
      email: user?.email,
      _id: user?.userId,
    }).exec();
    if (userData?.password !== user?.password)
      return res
        .status(401)
        .send({ error: 'Token is valid for one time only.' });
    const salt = await bcrypt.genSalt(5);
    const password = await bcrypt.hash(req?.body?.password, salt);
    const updatedUser = await User.findByIdAndUpdate(user?.userId, {
      password: password,
    });
    if (!updatedUser)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again later.' });
    res.status(200).send({
      message: 'New password is set. Please login with updated password.',
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const checkUserVerified = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body?.email }).exec();
    if (!user?.isActive)
      return res.status(400).send({ error: 'User not verified.' });
    res.status(200).send({
      user: user?._doc,
    });
  } catch (error) {
    errorMessage(res, error);
  }
};
