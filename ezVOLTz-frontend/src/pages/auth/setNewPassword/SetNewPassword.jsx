import { ErrorMessage, Field, Form, Formik } from 'formik';
import Spiner from 'helper/Spiner';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import useApiHook from 'hooks/useApiHook';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';

const SetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Minimum 8 character are required!')
    .max(16, 'Maximum 16 character are required!')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,16}$/,
      'Password must contain at least one number, one uppercase letter, one lowercase letter and one special character!'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .required('Confirm password is required!')
    .oneOf(
      [Yup.ref('password')],
      'Confirm password need to be the same as password'
    ),
});

const SetNewPassword = () => {
  const { auth } = useSelector((state) => state);
  const { token } = useParams();
  const navigate = useNavigate();
  const { handleApiCall, isApiLoading } = useApiHook();
  const [isTypePasssword, setIsTypePasssword] = useState(true);
  const [isTypeConfirmPasssword, setIsTypeConfirmPasssword] = useState(true);

  const handleSetPassword = async (values) => {
    if (!token) return toast.error('Verification token is not valid');
    const result = await handleApiCall({
      method: 'post',
      url: `/set-password/${token}`,
      data: { password: values?.password },
    });
    if (result?.status === 200) {
      toast.success(result?.data?.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
              <h3 className='text-2xl font-semibold mb-4 text-ezBlack'>
                Recover your account
              </h3>
              <p className='text-base mb-8 text-ezBlack'>
                Enter the fields below to get started
              </p>
              <Formik
                initialValues={{ password: '', confirmPassword: '' }}
                validationSchema={SetPasswordSchema}
                onSubmit={handleSetPassword}
              >
                {({}) => (
                  <Form className='ez__Form w-full'>
                    <div className='relative w-full'>
                      <Field
                        type={isTypePasssword ? 'password' : 'text'}
                        name='password'
                        placeholder='Password'
                        className='w-full block border border-ezBlack rounded-md text-base text-ezBlack p-5 mb-4'
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
                        className='w-full block border border-ezBlack rounded-md text-base text-ezBlack p-5 mb-4'
                      />
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
                    <button
                      type='submit'
                      disabled={isApiLoading}
                      className={`py-5 text-base mb-5 text-white border border-ezGreen bg-ezGreen rounded-md block w-full text-center ${
                        isApiLoading ? 'cursor-wait' : 'hover:bg-transparent'
                      } hover:text-ezGreen`}
                    >
                      {isApiLoading ? (
                        <Spiner color='white' />
                      ) : (
                        'Set New Password'
                      )}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;
