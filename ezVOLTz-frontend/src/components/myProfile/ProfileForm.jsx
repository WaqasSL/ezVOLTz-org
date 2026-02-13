import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { countriesName, usaStates } from 'helper/countries';
import { colourStyles } from 'helper/helper';
import useApiHook from 'hooks/useApiHook';
import { toast } from 'react-toastify';

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name is too short!')
    .max(50, 'Name is too long!')
    .matches(/^[a-zA-Z\s]*$/, 'Only letters are allowed')
    .required('Full Name is required')
    .trim(),
  country: Yup.string().required('Country is required!').trim(),
  state: Yup.string()
    .min(2, 'State is too short!')
    .max(20, 'State is too long!')
    .trim(),
  city: Yup.string()
    .matches(
      /^[A-Za-z\s]*$/,
      'Enter the valid city and that contains letters only.'
    )
    .required('City is required!')
    .min(3, 'City is too short!')
    .max(20, 'City is too long!')
    .trim(),
  zipCode: Yup.string().min(3, 'Zip Code is too short!').trim(),
});

export default function ProfileForm({ userInfo, getUserInfo }) {
  const { handleApiCall, isApiLoading } = useApiHook();

  const updateProfile = async (data) => {
    const result = await handleApiCall({
      method: 'patch',
      url: `user/profile/${userInfo?.user?._id}`,
      data,
    });
    if (result?.status === 200) {
      toast.success('Your profile updated successfully!');
      getUserInfo();
    }
  };

  return (
    <div className='w-full block'>
      <Formik
        initialValues={{
          name: userInfo?.user?.name || '',
          country: userInfo?.user?.country || '',
          state: userInfo?.user?.state || '',
          city: userInfo?.user?.city || '',
          zipCode: userInfo?.user?.zipCode || '',
        }}
        validationSchema={SignupSchema}
        onSubmit={updateProfile}
      >
        {({ values, setFieldValue }) => (
          <Form className='ez__Form w-full block relative'>
            <div className='block'>
              <label htmlFor='name' className='block mb-1 text-sm text-ezBlack'>
                Full Name
              </label>
              <Field
                type='text'
                name='name'
                id='name'
                placeholder='Full Name'
                className='w-full block border border-ezBlack rounded-md text-sm text-ezBlack p-3.5 mb-4'
              />
              <ErrorMessage
                name='name'
                render={(msg) => (
                  <p className='text-xs text-ezRed block mb-4 -mt-3'>{msg}</p>
                )}
              />
            </div>
            <div className='block'>
              <label
                htmlFor='email'
                className='block mb-1 text-sm text-ezBlack'
              >
                Email
              </label>
              <Field
                type='email'
                value={userInfo?.user?.email}
                name='email'
                readOnly
                id='email'
                className='cursor-not-allowed w-full block border border-ezBlack rounded-md text-sm text-ezBlack p-3.5 mb-4'
              />
            </div>
            <div className='block'>
              <label htmlFor='city' className='block mb-1 text-sm text-ezBlack'>
                City
              </label>
              <Field
                type='text'
                name='city'
                placeholder='City'
                className='w-full block border border-ezBlack rounded-md text-sm text-ezBlack p-3.5 mb-4'
              />
              <ErrorMessage
                name='city'
                render={(msg) => (
                  <p className='text-xs text-ezRed block mb-4 -mt-3'>{msg}</p>
                )}
              />
            </div>
            <div className='block'>
              <label
                htmlFor='state'
                className='block mb-1 text-sm text-ezBlack'
              >
                State
              </label>
              <Select
                className='basic-single mb-4'
                classNamePrefix='select'
                placeholder='Select State'
                isClearable={true}
                isSearchable={true}
                styles={colourStyles}
                name='country'
                value={
                  values?.state && {
                    label: values?.state,
                    value: values?.state,
                  }
                }
                onChange={(state) => setFieldValue('state', state?.value)}
                options={usaStates?.map((state) => {
                  return {
                    label: state,
                    value: state,
                  };
                })}
              />
              <ErrorMessage
                name='state'
                render={(msg) => (
                  <p className='text-sm text-ezRed block mb-4 -mt-3'>{msg}</p>
                )}
              />
            </div>
            <div className='block'>
              <label
                htmlFor='zipCode'
                className='block mb-1 text-sm text-ezBlack'
              >
                Zip Code
              </label>
              <Field
                type='text'
                name='zipCode'
                placeholder='Zip Code'
                className='w-full block border border-ezBlack rounded-md text-sm text-ezBlack p-3.5 mb-4'
              />
            </div>
            <div className='block headerFormSelect'>
              <label
                htmlFor='country'
                className='block mb-1 text-sm text-ezBlack'
              >
                Country
              </label>
              <Select
                className='basic-single mb-4'
                classNamePrefix='select'
                placeholder='Select Country'
                isSearchable={true}
                styles={colourStyles}
                name='country'
                value={
                  values?.country && {
                    label: values?.country,
                    value: values?.country,
                  }
                }
                onChange={(country) => setFieldValue('country', country?.value)}
                options={countriesName?.map((country) => {
                  return {
                    label: country,
                    value: country,
                  };
                })}
              />
              <ErrorMessage
                name='country'
                render={(msg) => (
                  <p className='text-xs text-ezRed block mb-4 -mt-3'>{msg}</p>
                )}
              />
            </div>
            <div className='block'>
              <button
                type='submit'
                disabled={isApiLoading}
                className={`py-2 text-sm text-white border border-ezGreen bg-ezGreen rounded-md block w-max px-10 text-center ${
                  isApiLoading ? 'cursor-wait' : 'hover:bg-transparent'
                } hover:text-ezGreen`}
              >
                Update Profile
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
