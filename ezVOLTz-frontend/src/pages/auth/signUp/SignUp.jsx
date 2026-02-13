import { Link, useNavigate } from 'react-router-dom';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import Loader from 'helper/Loader';
import { useSelector } from 'react-redux';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import useApiHook from 'hooks/useApiHook';
import { toast } from 'react-toastify';
import PrimaryBtn from 'components/btns/PrimaryBtn';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name is too short.')
    .max(50, 'Name is too long.')
    .matches(/^[a-zA-Z\s]*$/, 'Name containt letters only')
    .required('Full Name is required')
    .trim(),
  email: Yup.string()
    .email('Please enter valid email')
    .required('Email is required')
    .trim(),
  phone: Yup.string().required('Phone number is requred').trim(),
  password: Yup.string()
    .min(8, 'Minimum 8 characters are required.')
    .max(16, 'Maximum 16 character are required.')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,16}$/,
      'Password must contain at least one number, one uppercase letter, one lowercase letter and one special character!'
    )
    .required('Password is required')
    .trim(),
  confirmPassword: Yup.string()
    .required('Confirm password is required!')
    .trim()
    .oneOf(
      [Yup.ref('password')],
      'Confirm password need to be the same as password'
    ),
});

const initialState = {
  name: '',
  email: '',
  password: '',
  phone: '',
  confirmPassword: '',
};

const SignUp = () => {
  const { auth } = useSelector((state) => state);
  const navigate = useNavigate();
  const { handleApiCall, isApiLoading } = useApiHook();
  const [userEmail, setUserEmail] = useState('');
  const [isTypePasssword, setIsTypePasssword] = useState(true);
  const [isTypeConfirmPasssword, setIsTypeConfirmPasssword] = useState(true);
  const [isVerification, setIsVerification] = useState(false);

  const handleSignUp = async (values) => {
    if (!isPossiblePhoneNumber(values?.phone))
      return toast.error('Invalid phone number');
    setUserEmail(values?.email);
    const result = await handleApiCall({
      method: 'post',
      url: '/register',
      data: {
        ...values,
        registerMethod: 'email',
        platform: 'web',
      },
      headers: { Authorization: 'none' },
    });
    if (result.status === 200) {
      toast.success(result?.data?.message);
      setIsVerification(true);
    }
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

  return (
    <div className='ez__AuthPage w-full ez__Login'>
      {isApiLoading && <Loader background='transparency' />}
      <div className='max-w-7xl mx-auto px-8'>
        <div className='grid grid-cols1 lg:grid-cols-3 gap-10 items-center py-24 border-b-8 border-ezGreen w-full min-h-screen	'>
          <div className='hidden lg:block lg:col-span-2 w-full'>
            <img
              src='/assets/images/login.png'
              alt='Login'
              className='w-full h-auto'
            />
          </div>
          <div className='ez__AuthForm'>
            <div className='title w-full flex items-center justify-center flex-col'>
              <img
                src='/assets/images/logo.png'
                alt='Logo'
                className='h-20 w-auto block mb-8'
              />
              {!isVerification && (
                <>
                  <h3 className='text-2xl font-semibold mb-4 text-ezBlack'>
                    Create your account
                  </h3>
                  <p className='text-base mb-8 text-ezBlack'>
                    Enter the fields below to get started
                  </p>
                </>
              )}
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
                <>
                  <Formik
                    initialValues={initialState}
                    validationSchema={SignupSchema}
                    onSubmit={handleSignUp}
                  >
                    {({ errors, values, setFieldValue }) => (
                      <Form className='ez__Form w-full'>
                        <Field
                          type='text'
                          name='name'
                          placeholder='Full Name'
                          className='w-full block border border-ezBlack rounded-md text-base text-ezBlack p-4 mb-4'
                        />
                        <ErrorMessage
                          name='name'
                          render={(msg) => (
                            <p className='text-sm text-ezRed block mb-4 -mt-3'>
                              {msg}
                            </p>
                          )}
                        />
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
                        <div className='w-full block border border-ezBlack rounded-md text-sm text-ezBlack p-4 '>
                          <PhoneInput
                            placeholder='Enter phone number'
                            value={values?.phone}
                            onChange={(value) => setFieldValue('phone', value)}
                            country='US'
                            international={false}
                            withCountryCallingCode
                            defaultCountry='US'
                            initialValueFormat='+1'
                            countries={['US']}
                            rules={{
                              required: true,
                              validate: isPossiblePhoneNumber,
                            }}
                          />
                        </div>
                        <div className='mb-4'>
                          {errors?.phone && (
                            <p className='text-ezRed text-sm'>
                              {errors?.phone}
                            </p>
                          )}
                        </div>
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
                        <div className='relative w-full'>
                          <Field
                            type={isTypeConfirmPasssword ? 'password' : 'text'}
                            name='confirmPassword'
                            placeholder='Confirm Password'
                            className='w-full block border border-ezBlack rounded-md text-base text-ezBlack p-4 mb-4'
                          />{' '}
                          <button
                            type='button'
                            onClick={() =>
                              setIsTypeConfirmPasssword(!isTypeConfirmPasssword)
                            }
                            className='absolute top-5 right-4 z-50 w-max text-ezBlack hover:text-ezGreen'
                          >
                            {isTypeConfirmPasssword ? (
                              <BsFillEyeSlashFill className='w-5 h-5' />
                            ) : (
                              <BsFillEyeFill className='w-5 h-5 ' />
                            )}
                          </button>
                        </div>
                        <ErrorMessage
                          name='confirmPassword'
                          render={(msg) => (
                            <p className='text-sm text-ezRed block mb-4 -mt-3'>
                              {msg}
                            </p>
                          )}
                        />
                        <PrimaryBtn
                          btnType='submit'
                          isApiLoading={isApiLoading}
                          text='Sign Up'
                        />
                      </Form>
                    )}
                  </Formik>
                  <p className='text-base text-ezBlack text-center'>
                    Already have an account?{' '}
                    <Link
                      to='/login'
                      className='block sm:block text-ezGreen font-semibold hover:text-ezGreen'
                    >
                      Log In
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
