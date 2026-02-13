import { Link, useNavigate } from 'react-router-dom';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Spiner from 'helper/Spiner';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useApiHook from 'hooks/useApiHook';
import { toast } from 'react-toastify';
import PrimaryBtn from 'components/btns/PrimaryBtn';

const ForgotPassword = () => {
  const { auth } = useSelector((state) => state);
  const navigate = useNavigate();
  const { handleApiCall, isApiLoading } = useApiHook();
  const [isVerification, setIsVerification] = useState(false);
  const [userEmail, setUserEmail] = useState(false);

  const handleResetPassword = async (values) => {
    const result = await handleApiCall({
      method: 'post',
      url: '/forgot-password',
      data: values,
    });
    if (result.status === 200) {
      toast.success('Reset password email sent successfully.');
      setIsVerification(true);
      setUserEmail(values.email);
    }
  };

  useEffect(() => {
    if (auth?.isLogin) navigate('/home');
  }, [auth?.isLogin]);

  return (
    <div className='ez__AuthPage w-full ez__Login'>
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
              {isVerification ? (
                <div className='text-center rounded-md my-10 w-full h-full relative'>
                  <h3 className='text-ezBlack font-bold text-lg md:text-xl mb-6'>
                    Forgot Password Email!
                  </h3>
                  <p className='mb-3 text-ezBlack text-base text-center'>
                    ezVOLTz sent you the forgot password email. Please check
                    your inbox and follow the instructions in the email to reset
                    your password.
                  </p>
                  <p className='text-ezBlack text-base text-center'>
                    If email is not received, Click here to{' '}
                    <button
                      onClick={() => handleResetPassword({ email: userEmail })}
                      disabled={isApiLoading}
                      className='text-ezGreen font-semibold hover:text-ezGreen'
                    >
                      Resend Email
                    </button>
                  </p>
                </div>
              ) : (
                <>
                  <h3 className='text-2xl font-semibold mb-4 text-ezBlack'>
                    Recover your account
                  </h3>
                  <p className='text-base mb-8 text-ezBlack'>
                    Enter the fields below to get started
                  </p>
                  <Formik
                    initialValues={{ email: '' }}
                    validationSchema={Yup.object().shape({
                      email: Yup.string()
                        .email('Please enter valid email')
                        .required('Email is required'),
                    })}
                    onSubmit={handleResetPassword}
                  >
                    {({}) => (
                      <Form className='ez__Form w-full'>
                        <Field
                          type='email'
                          name='email'
                          placeholder='Email'
                          className='w-full block border border-ezBlack rounded-md text-base text-ezBlack p-5 mb-4'
                        />
                        <ErrorMessage
                          name='email'
                          render={(msg) => (
                            <p className='text-sm text-ezRed block mb-4 -mt-3'>
                              {msg}
                            </p>
                          )}
                        />
                        <PrimaryBtn
                          btnType='submit'
                          text='Reset Password'
                          isApiLoading={isApiLoading}
                        />
                      </Form>
                    )}
                  </Formik>
                  <p className='text-base text-ezBlack text-center'>
                    Already have an account?{' '}
                    <Link
                      to='/login'
                      className='block sm:inline-block text-ezGreen font-semibold hover:text-ezGreen'
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

export default ForgotPassword;
