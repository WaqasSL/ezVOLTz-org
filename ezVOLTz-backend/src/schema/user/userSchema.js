import { boolean, object, string } from 'yup';

export const registerSchema = object({
  name: string().required('Name is required.'),
  email: string()
    .required('Email is required.')
    .email('Please enter valid email.'),
  password: string(),
  platform: string().required('Platform is required.'),
  registerMethod: string().required(
    'Please tell me about the registration method.'
  ),
  profileImage: string(),
  phone: string(),
  country: string(),
  state: string(),
  city: string(),
  zipCode: string(),
  isActive: boolean(),
});

export const socialRegisterSchema = object({
  name: string(),
  platform: string()?.required('Platform is required.'),
  registerMethod: string()?.required(
    'Please tell me about the registration method.'
  ),
  phone: string(),
  profileImage: string(),
  isActive: boolean(),
});

export const appleRegisterSchema = object({
  code: string().required('Apple code is required.'),
  name: string().required('Name is required.'),
  platform: string()?.required('Platform is required.'),
  registerMethod: string()?.required(
    'Please tell me about the registration method.'
  ),
  phone: string(),
  email: string(),
  appleUserId: string(),
  appleRefreshToken: string(),
});

export const loginSchema = object({
  email: string()
    .required('Email is required.')
    .email('Please enter valid email'),
  password: string(),
  registerMethod: string().required(
    'Please tell me about the registration method.'
  ),
});

export const resendVerifySchema = object({
  email: string()
    .required('Email is required.')
    .email('Please enter valid email'),
});

export const verifyPhoneCode = object({
  otpCode: string().required('OTP code is required.'),
  phone: string().required('Phone number is required.'),
});
