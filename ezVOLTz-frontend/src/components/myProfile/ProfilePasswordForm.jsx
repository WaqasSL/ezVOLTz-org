import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import useApiHook from 'hooks/useApiHook';
import { toast } from 'react-toastify';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { useState } from 'react';

const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(8, 'Minimum 8 character are required!')
    .required('Current Password is required')
    .trim(),
  password: Yup.string()
    .min(8, 'Minimum 8 character are required!')
    .max(16, 'Maximum 16 character are required!')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,16}$/,
      'Password must contain at least one number, one uppercase letter, one lowercase letter and one special character!'
    )
    .required('New Password is required')
    .trim(),
  confirmPassword: Yup.string()
    .required('Confirm password is required!')
    .oneOf(
      [Yup.ref('password')],
      'Confirm password need to be the same as password'
    )
    .trim(),
});

const SetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Minimum 8 character are required!')
    .max(16, 'Maximum 16 character are required!')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,16}$/,
      'Password must contain at least one number, one uppercase letter, one lowercase letter and one special character!'
    )
    .required('New Password is required')
    .trim(),
  confirmPassword: Yup.string()
    .required('Confirm password is required!')
    .oneOf(
      [Yup.ref('password')],
      'Confirm password need to be the same as password'
    )
    .trim(),
});

export default function ProfilePasswordForm({ userInfo, getUserInfo }) {
  const { handleApiCall, isApiLoading } = useApiHook();
  const [isTypeCPasssword, setIsTypeCPasssword] = useState(true);
  const [isTypePasssword, setIsTypePasssword] = useState(true);
  const [isTypeConPasssword, setIsTypeConPasssword] = useState(true);

  const updatePassword = async (data, resetForm) => {
    const result = await handleApiCall({
      method: 'patch',
      url: `user/profile-password/${userInfo?.user?._id}`,
      data: {
        password: data?.password,
        oldPassword: data?.currentPassword,
      },
    });
    if (result?.status === 200) {
      toast.success(result?.data?.message);
      getUserInfo();
      resetForm({
        currentPassword: '',
        password: '',
        confirmPassword: '',
      });
    }
  };

  return (
    <div className='w-full block'>
      <Formik
        initialValues={
          userInfo?.user?.password
            ? {
                currentPassword: '',
                password: '',
                confirmPassword: '',
              }
            : {
                password: '',
                confirmPassword: '',
              }
        }
        validationSchema={
          userInfo?.user?.password ? PasswordSchema : SetPasswordSchema
        }
        onSubmit={async (values, { resetForm }) => {
          updatePassword(values, resetForm);
        }}
      >
        {() => (
          <Form className='ez__Form w-full block relative'>
            {userInfo?.user?.password && (
              <div className='block'>
                <label
                  htmlFor='currentPassword'
                  className='block mb-1 text-sm text-ezBlack'
                >
                  Current Password
                </label>
                <div className='relative w-full'>
                  <Field
                    type={isTypeCPasssword ? 'password' : 'text'}
                    name='currentPassword'
                    placeholder='Current Password'
                    className='w-full block border border-ezBlack rounded-md text-sm text-ezBlack p-3.5 mb-4'
                  />
                  <button
                    type='button'
                    onClick={() => setIsTypeCPasssword(!isTypeCPasssword)}
                    className='absolute top-5 right-4 z-50 w-max text-ezBlack hover:text-ezGreen'
                  >
                    {isTypeCPasssword ? (
                      <BsFillEyeSlashFill className='w-5 h-5' />
                    ) : (
                      <BsFillEyeFill className='w-5 h-5 ' />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name='currentPassword'
                  render={(msg) => (
                    <p className='text-sm text-ezRed block mb-4 -mt-3'>{msg}</p>
                  )}
                />
              </div>
            )}
            <div className='block'>
              <label
                htmlFor='password'
                className='block mb-1 text-sm text-ezBlack'
              >
                New Password
              </label>
              <div className='relative w-full'>
                <Field
                  type={isTypePasssword ? 'password' : 'text'}
                  name='password'
                  placeholder='New Password'
                  className='w-full block border border-ezBlack rounded-md text-sm text-ezBlack p-3.5 mb-4'
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
                  <p className='text-sm text-ezRed block mb-4 -mt-3'>{msg}</p>
                )}
              />
            </div>
            <div className='block'>
              <label
                htmlFor='confirmPassword'
                className='block mb-1 text-sm text-ezBlack'
              >
                Confirm Password
              </label>
              <div className='relative w-full'>
                <Field
                  type={isTypeConPasssword ? 'password' : 'text'}
                  name='confirmPassword'
                  placeholder='Confirm Password'
                  className='w-full block border border-ezBlack rounded-md text-sm text-ezBlack p-3.5 mb-4'
                />
                <button
                  type='button'
                  onClick={() => setIsTypeConPasssword(!isTypeConPasssword)}
                  className='absolute top-5 right-4 z-50 w-max text-ezBlack hover:text-ezGreen'
                >
                  {isTypeConPasssword ? (
                    <BsFillEyeSlashFill className='w-5 h-5' />
                  ) : (
                    <BsFillEyeFill className='w-5 h-5 ' />
                  )}
                </button>
              </div>
              <ErrorMessage
                name='confirmPassword'
                render={(msg) => (
                  <p className='text-sm text-ezRed block mb-4 -mt-3'>{msg}</p>
                )}
              />
            </div>
            <div className='block'>
              <button
                type='submit'
                disabled={isApiLoading}
                className={`py-2 px-10 text-sm mb-5 text-white border border-ezGreen bg-ezGreen rounded-md block w-max text-center ${
                  isApiLoading ? 'cursor-wait' : 'hover:bg-transparent'
                } hover:text-ezGreen`}
              >
                {userInfo?.user?.password ? 'Update Password' : 'Set Password'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
