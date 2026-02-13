import PhoneVerification from 'components/myProfile/PhoneVerification';
import ProfileForm from 'components/myProfile/ProfileForm';
import ProfilePasswordForm from 'components/myProfile/ProfilePasswordForm';
import Spiner from 'helper/Spiner';
import useApiHook from 'hooks/useApiHook';
import DeleteAccount from 'modals/deleteAccount/DeleteAccount';
import { useState } from 'react';
import Avatar from 'react-avatar';
import { BsCameraFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { toggleLogin, updateUser } from 'redux/auth/authSlice';

export default function Profile() {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isApiLoading, handleApiCall } = useApiHook();
  const [isModal, setIsModal] = useState(false);

  const deleteUserAccount = async () => {
    const result = await handleApiCall({
      method: 'delete',
      url: `user/profile/delete/${auth?.userInfo?.user?._id}`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (result?.status === 200) {
      setIsModal(false);
      dispatch(toggleLogin({ isLogin: false, userInfo: null }));
      toast.success(result?.data?.message);
      setTimeout(() => {
        navigate('/login');
      }, 100);
    }
  };

  const updateProfileImage = async (image) => {
    if (!image)
      return toast.error('Please select image to update the profile.');
    const formData = new FormData();
    formData.append('image', image);
    const result = await handleApiCall({
      method: 'post',
      url: `user/profile-image/${auth?.userInfo?.user?._id}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (result?.status === 200) {
      toast.success('Profile image uploaded successfully!');
      getUserInfo();
    }
  };

  const getUserInfo = async () => {
    const result = await handleApiCall({
      method: 'get',
      url: 'user/profile',
    });
    if (result?.status === 200) {
      dispatch(updateUser(result.data?.user));
    }
  };

  return (
    <div className='ez__Profile w-full relative'>
      {isApiLoading && (
        <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center transparency z-50'>
          <Spiner color='ezGreen' />
        </div>
      )}
      <div className='divide-y divide-ezGray/5'>
        <div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-5 md:py-16 sm:px-6 md:grid-cols-3 lg:px-8'>
          <div>
            <h2 className='text-base font-semibold leading-7 text-ezGray'>
              Personal Information
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-400'>
              Use a valid info where you can see more features.
            </p>
          </div>

          <div className='md:col-span-2'>
            <div className='col-span-full flex items-center gap-x-4 mb-5'>
              <div className='block w-24 h-24 rounded-full overflow-hidden relative group'>
                {auth?.userInfo?.user?.profileImage ? (
                  <img
                    src={auth?.userInfo?.user?.profileImage}
                    alt='Profile Image'
                    className='h-24 w-24 flex-none rounded-full  object-cover'
                  />
                ) : (
                  <div className='w-24 h-24 block'>
                    <Avatar
                      name={auth?.userInfo?.user?.name}
                      round={true}
                      size={100}
                    />
                  </div>
                )}
                <label className='hidden group-hover:flex absolute top-0 left-0 w-full h-full items-center justify-center bg-black bg-opacity-40'>
                  <BsCameraFill className='w-10 h-10 text-white' />
                  <input
                    type='file'
                    onChange={(e) => updateProfileImage(e.target.files[0])}
                    id='image'
                    name='image'
                    accept='image/*'
                    className='absolute w-full h-full opacity-0 top-0 right-0 cursor-pointer'
                  />
                </label>
              </div>

              <div className='block'>
                <p className='text-sm md:text-xl leading-5 text-ezBlack'>
                  {auth?.userInfo?.user?.name}
                </p>
                <p className='text-sm leading-5 text-ezBlack'>
                  {auth?.userInfo?.user?.email}
                </p>
              </div>
            </div>
            <div className='md:w-2/3 block'>
              <ProfileForm
                getUserInfo={getUserInfo}
                userInfo={auth?.userInfo}
              />
            </div>
          </div>
        </div>

        <div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-5 md:py-16 sm:px-6 md:grid-cols-3 lg:px-8'>
          <div>
            <h2 className='text-base font-semibold leading-7 text-ezGray'>
              Phone Number
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-400'>
              Use a valid phone number where you'll receive an SMS.
            </p>
          </div>

          <div className='md:col-span-2'>
            <div className='col-span-full flex items-center gap-x-4 mb-5 md:w-2/3'>
              <PhoneVerification
                getUserInfo={getUserInfo}
                userInfo={auth?.userInfo}
              />
            </div>
          </div>
        </div>

        <div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-5 md:py-16 sm:px-6 md:grid-cols-3 lg:px-8'>
          <div>
            <h2 className='text-base font-semibold leading-7 text-ezGray'>
              Change password
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-400'>
              Update your password associated with your account.
            </p>
          </div>

          <div className='md:col-span-2 md:w-2/3 block'>
            <ProfilePasswordForm
              getUserInfo={getUserInfo}
              userInfo={auth?.userInfo}
            />
          </div>
        </div>

        <div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-5 md:py-16 sm:px-6 md:grid-cols-3 lg:px-8 items-end'>
          <div>
            <h2 className='text-base font-semibold leading-7 text-ezGray'>
              Delete account
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-400'>
              No longer want to use our service? You can delete your account
              here. This action is not reversible. All information related to
              this account will be deleted permanently.
            </p>
          </div>

          <div className='flex items-start md:col-span-2'>
            <button
              type='button'
              onClick={() => setIsModal(!isModal)}
              className='rounded-md bg-ezRed border-ezRed border px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-transparent hover:text-ezRed'
            >
              Yes, delete my account
            </button>
          </div>
        </div>
      </div>
      {isModal && (
        <DeleteAccount
          isApiLoading={isApiLoading}
          isModal={isModal}
          setIsModal={setIsModal}
          deleteUserAccount={deleteUserAccount}
        />
      )}
    </div>
  );
}
