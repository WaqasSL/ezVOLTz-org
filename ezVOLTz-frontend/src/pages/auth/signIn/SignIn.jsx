import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import FbAuthButton from 'helper/FbAuthButton';
import Loader from 'helper/Loader';
import jwtDecode from 'jwt-decode';
import SignFBEmail from 'modals/signIn/SignFBEmail';
import useApiHook from 'hooks/useApiHook';
import { toast } from 'react-toastify';
import { toggleLogin } from 'redux/auth/authSlice';
import PrimaryBtn from 'components/btns/PrimaryBtn';
import AppleLoginButton from 'helper/AppleLoginButton';
import SignAppleModal from 'modals/signIn/SignAppleModal';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { isPossiblePhoneNumber } from 'react-phone-number-input';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter valid email')
    .required('Email is required')
    .trim(),
  password: Yup.string()
    .min(8, 'Minimum 8 character are required!')
    .max(20, 'Maximum 20 character are required!')
    .required('Password is required')
    .trim(),
});

const SignIn = () => {
  const { auth } = useSelector((state) => state);
  const { handleApiCall, isApiLoading } = useApiHook();
  const [isTypePasssword, setIsTypePasssword] = useState(true);
  const [isVerification, setIsVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [appleFormValues, setAppleFormValues] = useState({
    isAppleModal: false,
    isNameRequired: false,
    isPhoneRequired: false,
    name: '',
    phone: '',
    appleUserId: '',
    appleRefreshToken: '',
    token: '',
    registerMethod: 'apple',
    platform: 'web',
  });
  const [fbFormValues, setFBFormValues] = useState({
    isFbEmail: false,
    email: '',
    name: '',
    profileImage: '',
    fbUserId: '',
    registerMethod: 'facebook',
    platform: 'web',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    const result = await handleApiCall({
      method: 'post',
      url: '/login',
      data: {
        ...values,
        registerMethod: 'email',
      },
      headers: { Authorization: 'none' },
    });
    if (result.status === 200) {
      if (result?.data?.isEmailSent) {
        toast.success(result?.data?.message);
        setIsVerification(true);
        setUserEmail(values?.email);
      } else {
        dispatch(
          toggleLogin({
            isLogin: true,
            userInfo: result?.data,
          })
        );
        toast.success('You have login successfully!');
        navigate('/home');
      }
    }
  };

  const handleSocialSignIn = async (values) => {
    const result = await handleApiCall({
      method: 'post',
      url: '/social-login',
      data: values,
      headers: { Authorization: 'none' },
    });
    if (result.status === 203) {
      toast.error(result?.data?.error);
      setFBFormValues({
        isFbEmail: true,
        isEmailRequired: result?.data?.isEmailRequired,
        isPhoneRequired: result?.data?.isPhoneRequired,
        email: result?.data?.email,
        phone: result?.data?.phone,
        name: result?.data?.name,
        profileImage: result?.data?.profileImage,
        fbUserId: result?.data?.fbUserId,
        registerMethod: result?.data?.registerMethod,
        platform: 'web',
      });
    }
    if (result.status === 200) {
      dispatch(
        toggleLogin({
          isLogin: true,
          userInfo: result?.data,
        })
      );
      toast.success('You have login successfully!');
      navigate('/home');
    }
  };

  const appleLoginSuccess = async (response) => {
    if (response.error) return;
    const result = await handleApiCall({
      method: 'post',
      url: '/apple/apple-signin',
      data: {
        ...response,
        name:
          response?.user?.name?.firstName || response?.user?.name?.lastName
            ? `${response?.user?.name?.firstName} ${response?.user?.name?.lastName}`
            : null,
        platform: 'web',
        registerMethod: 'apple',
      },
      headers: { Authorization: 'none' },
    });
    if (result?.status === 203) {
      toast.error(result?.data?.error);
      setAppleFormValues({
        ...appleFormValues,
        isAppleModal: true,
        isNameRequired: result?.data?.isNameRequired,
        isPhoneRequired: result?.data?.isPhoneRequired,
        name: result?.data?.name || '',
        phone: result?.data?.phone || '',
        appleUserId: result?.data?.appleUserId || '',
        appleRefreshToken: result?.data?.appleRefreshToken || '',
        token: result?.data?.token || '',
      });
    }
    if (result?.status === 200) {
      dispatch(
        toggleLogin({
          isLogin: true,
          userInfo: result?.data,
        })
      );
      toast.success('You have login successfully!');
      navigate('/home');
    }
  };

  const handleAppleSignIn = async () => {
    if (!appleFormValues?.name || !appleFormValues?.phone)
      return toast.error('Please fill both the fields.');
    if (!isPossiblePhoneNumber(appleFormValues?.phone))
      return toast.error('Invalid phone number');
    const result = await handleApiCall({
      method: 'post',
      url: '/apple/apple-signin',
      data: appleFormValues,
      headers: { Authorization: 'none' },
    });
    if (result?.status === 200) {
      dispatch(
        toggleLogin({
          isLogin: true,
          userInfo: result?.data,
        })
      );
      toast.success('You have login successfully!');
      navigate('/home');
    }
  };

  const continueAsGuest = async () => {
    dispatch(
      toggleLogin({
        isLogin: true,
        userInfo: {
          user: {
            name: `Guest User`,
            isActive: false,
            role: 'guest',
          },
        },
      })
    );
    toast.success('You have continued in guest mode.');
    navigate('/home');
  };

  const handleFacebookResponse = (values) => {
    let info = {
      email: values?.data?.email,
      name: values?.data?.name
        ? values?.data?.name
        : values?.data?.first_name && values?.data?.last_name
        ? `${values?.data?.first_name} ${values?.data?.last_name}`
        : values?.data?.first_name,
      profileImage: values?.data?.picture?.data?.url,
      fbUserId: values?.data?.userID,
      registerMethod: 'facebook',
      platform: 'web',
    };
    if (info?.fbUserId && info?.name) return handleSocialSignIn(info);
  };

  const handleGoogleResponse = (values) => {
    let decode = jwtDecode(values?.credential);
    return handleSocialSignIn({
      email: decode?.email,
      name: decode?.name,
      profileImage: decode?.picture,
      registerMethod: 'google',
      platform: 'web',
    });
  };

  const handleResendEmail = async () => {
    const result = await handleApiCall({
      method: 'post',
      url: '/resend-verify',
      data: { email: userEmail },
      headers: { Authorization: 'none' },
    });
    if (result.status === 200) toast.success(result?.data?.message);
  };

  useEffect(() => {
    if (auth?.isLogin) navigate('/home');
  }, [auth?.isLogin]);

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });
    google.accounts.id.renderButton(document.getElementById('buttonDiv'), {
      theme: 'outline',
      size: 'large',
    });
    if (!auth?.isLogin && !isVerification) google.accounts.id.prompt();
  }, []);

  return (
    <div className='ez__AuthPage w-full ez__Login relative'>
      {isApiLoading && <Loader background='transparency' />}
      <div className='max-w-7xl mx-auto px-8'>
        <div className='grid grid-cols1 lg:grid-cols-3 gap-10 items-center py-24 border-b-8 border-ezGreen w-full min-h-screen'>
          <div className='hidden lg:block lg:col-span-2 w-full'>
            <img
              src='/assets/images/login.png'
              alt='Login'
              className='w-full h-auto'
            />
          </div>
          <div className='ez__AuthForm'>
            {isVerification ? (
              <div className='py-10 rounded-md flex flex-col items-center justify-center w-full h-full relative'>
                <h3 className='text-ezBlack font-bold text-lg md:text-xl mb-6'>
                  Please verify your Email!
                </h3>
                <p className='text-ezBlack text-base text-center mb-3'>
                  A verification email has been sent to{' '}
                  <b className='text-ezGreen font-semibold'>{userEmail}</b>.
                  Please check your inbox and verify your email.
                </p>
                <p className='text-ezBlack text-base text-center'>
                  If email is not received, Click here to{' '}
                  <button
                    onClick={handleResendEmail}
                    disabled={isApiLoading}
                    className='text-ezGreen font-semibold hover:text-ezGreen'
                  >
                    Resend Email
                  </button>
                </p>
              </div>
            ) : (
              <div className='title w-full flex items-center justify-center flex-col'>
                <img
                  src='/assets/images/logo.png'
                  alt='Logo'
                  className='h-20 w-auto block mb-8'
                />
                <h3 className='text-2xl font-semibold mb-4 text-ezBlack'>
                  Log into your account
                </h3>
                <p className='text-base mb-8 text-ezBlack'>
                  Enter the fields below to get started
                </p>
                <div className='w-full flex justify-center mb-4'>
                  <div id='buttonDiv' />
                </div>
                <FbAuthButton
                  handleFacebookResponse={handleFacebookResponse}
                  text='Signin with Facebook'
                />
                <AppleLoginButton appleLoginSuccess={appleLoginSuccess} />
                <button
                  className='bg-ezGreen/90 hover:bg-ezGreen w-full rounded-md text-white text-center p-3 mb-2'
                  onClick={continueAsGuest}
                >
                  Continue as Guest
                </button>

                <span className='block w-full ez__FormLine text-base text-ezBlack text-center relative my-3'>
                  or
                </span>
                <Formik
                  initialValues={{ email: '', password: '' }}
                  validationSchema={LoginSchema}
                  onSubmit={handleLogin}
                >
                  {() => (
                    <Form className='ez__Form w-full'>
                      <Field
                        type='email'
                        name='email'
                        placeholder='Email'
                        className='w-full block border border-ezBlack rounded-md text-base text-ezBlack p-4 mb-4'
                      />
                      <ErrorMessage
                        name='email'
                        render={(msg) => (
                          <p className='text-sm text-ezRed block mb-4 -mt-3'>
                            {msg}
                          </p>
                        )}
                      />
                      <div className='relative w-full'>
                        <Field
                          type={isTypePasssword ? 'password' : 'text'}
                          name='password'
                          placeholder='Password'
                          className='w-full block border border-ezBlack rounded-md text-base text-ezBlack p-4 mb-4'
                        />
                        <button
                          type='button'
                          onClick={() => setIsTypePasssword(!isTypePasssword)}
                          className='absolute top-5 right-4 z-50 w-max text-ezBlack hover:text-ezGreen'
                        >
                          {isTypePasssword ? (
                            <BsFillEyeSlashFill className='w-5 h-5' />
                          ) : (
                            <BsFillEyeFill className='w-5 h-5 ' />
                          )}
                        </button>
                      </div>
                      <ErrorMessage
                        name='password'
                        render={(msg) => (
                          <p className='text-sm text-ezRed block mb-4 -mt-3'>
                            {msg}
                          </p>
                        )}
                      />
                      <PrimaryBtn
                        btnType='submit'
                        isApiLoading={isApiLoading}
                        text='Login'
                      />
                    </Form>
                  )}
                </Formik>
                <p className='text-base text-ezBlack text-center mb-3'>
                  Forgot your password? Click here to
                  <Link
                    to='/forgot-password'
                    className='block sm:block text-ezGreen font-semibold hover:text-ezGreen'
                  >
                    Reset Password
                  </Link>
                </p>
                <p className='text-base text-ezBlack text-center'>
                  Don't have an account?{' '}
                  <Link
                    to='/sign-up'
                    className='block sm:block text-ezGreen font-semibold hover:text-ezGreen'
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {fbFormValues?.isFbEmail && (
        <SignFBEmail
          fbFormValues={fbFormValues}
          setFBFormValues={setFBFormValues}
          handleSocialSignIn={handleSocialSignIn}
          isLoading={isApiLoading}
        />
      )}
      {appleFormValues?.isAppleModal && (
        <SignAppleModal
          appleFormValues={appleFormValues}
          setAppleFormValues={setAppleFormValues}
          handleAppleSignIn={handleAppleSignIn}
          isLoading={isApiLoading}
        />
      )}
    </div>
  );
};

export default SignIn;
