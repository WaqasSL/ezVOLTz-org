import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLogin } from 'redux/auth/authSlice';
import { AiOutlineLogout } from 'react-icons/ai';
import { FaPencilAlt } from 'react-icons/fa';
import { checkUserAuthenticated } from 'helper/functionality';

const UserDropDown = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isUserAuthenticated = checkUserAuthenticated(auth?.userInfo);

  const handleLogout = (route) => {
    dispatch(toggleLogin({ isLogin: false, userInfo: null }));
    navigate(route);
  };

  return (
    <Fragment>
      <Popover className='relative'>
        {({ open, close }) => (
          <>
            <Popover.Button className='flex items-center text-sm focus:outline-none'>
              {auth?.userInfo?.user?.profileImage ? (
                <img
                  className='h-6 w-6 sm:h-8 sm:w-8 rounded-full border border-ezGreen block'
                  src={auth?.userInfo?.user?.profileImage}
                  alt='User Profile'
                />
              ) : (
                <div className='w-8 h-8 rounded-full overflow-hidden'>
                  <Avatar
                    name={auth?.userInfo?.user?.name}
                    round={true}
                    size={32}
                  />
                </div>
              )}
              <span className='ml-3 text-ezBlack text-base hidden sm:block'>
                {auth?.userInfo?.user?.name?.slice(0, 9)}{' '}
                {auth?.userInfo?.user?.name?.length > 9 ? '...' : ''}
              </span>
            </Popover.Button>

            <Transition
              as={Fragment}
              enter='transition ease-out duration-200'
              enterFrom='opacity-0 translate-y-1'
              enterTo='opacity-100 translate-y-0'
              leave='transition ease-in duration-150'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 translate-y-1'
            >
              <Popover.Panel className='absolute right-0 z-10 mt-1 w-screen max-w-md transform px-2 sm:px-0'>
                <div className='absolute right-0 z-10 mt-2 w-11/12 md:w-full max-w-md origin-top-right rounded-3xl bg-ezLightWhite shadow-lg focus:outline-none overflow-hidden '>
                  <div className='relative w-full block dropDownOverFlow'>
                    <div className='bg-white p-5 rounded-3xl m-2'>
                      <div
                        className={`ez__ProfilePicDiv flex flex-col sm:flex-row py-5 px-3 ${
                          isUserAuthenticated ? 'items-start' : 'items-center'
                        }`}
                      >
                        <div className=' block rounded-full w-20 h-20 relative z-1 group mb-3 sm:mb-0'>
                          {auth?.userInfo?.user?.profileImage ? (
                            <img
                              src={auth?.userInfo?.user?.profileImage}
                              alt='Profile Image'
                              className='w-20 h-20 object-cover rounded-full'
                            />
                          ) : (
                            <div className='w-20 h-20 block'>
                              <Avatar
                                name={auth?.userInfo?.user?.name}
                                round={true}
                                size={80}
                              />
                            </div>
                          )}
                          {isUserAuthenticated && (
                            <div className='ez__OverlayProfile absolute w-8 h-8 rounded-full bg-ezGreen bottom-0 right-0 cursor-pointer z-10 '>
                              <div className='relative w-8 h-8 flex items-center justify-center cursor-pointer'>
                                <Link
                                  to='/profile'
                                  onClick={close}
                                  className='absolute w-8 h-8 opacity-0 top-0 right-0 cursor-pointer'
                                />
                                <FaPencilAlt className='text-white w-3.5 h-3.5  cursor-pointer' />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className='block w-max sm:ml-5'>
                          <p className='text-ezGray flex text-sm font-bold items-center mb-1'>
                            {auth?.userInfo?.user?.name}
                          </p>
                          <p className='text-ezGray flex text-sm items-center mb-1'>
                            {auth?.userInfo?.user?.email}
                          </p>
                          {isUserAuthenticated ? (
                            <>
                              <p className='text-ezGray flex text-sm items-center mb-1'>
                                {auth?.userInfo?.user?.city}
                              </p>
                              <p className='text-ezGray flex text-sm items-center mb-1'>
                                {auth?.userInfo?.user?.state}
                              </p>
                              <p className='text-ezGray flex text-sm items-center mb-1'>
                                {auth?.userInfo?.user?.zipCode}
                              </p>
                              <p className='text-ezGray flex text-sm items-center mb-1'>
                                {auth?.userInfo?.user?.country}
                              </p>
                              <p className='text-ezGray flex text-sm items-center'>
                                {auth?.userInfo?.user?.phone}
                              </p>
                            </>
                          ) : (
                            <div className='mt-3 w-full grid sm:grid-cols-2 gap-3'>
                              <button
                                type='button'
                                onClick={() => handleLogout('/login')}
                                className='inline-flex w-full justify-center rounded-md border border-ezGreen TransAni bg-ezGreen hover:bg-transparent px-5 py-1 text-sm font-semibold text-white hover:text-ezGreen shadow-sm'
                              >
                                Login
                              </button>
                              <button
                                type='button'
                                onClick={() => handleLogout('/sign-up')}
                                className='inline-flex w-full justify-center rounded-md border border-ezGreen TransAni hover:bg-ezGreen px-5 py-1 text-sm font-semibold text-ezGreen hover:text-white shadow-sm'
                              >
                                Register
                              </button>
                            </div>
                          )}
                          {isUserAuthenticated && (
                            <Link
                              to='/profile'
                              onClick={close}
                              className='absolute top-0 right-5 text-ezGreen mt-5 text-xs hover:text-ezGreen block'
                            >
                              View Profile
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLogout('/login')}
                      className='w-full flex items-center text-left  hover:bg-ezLightGreen px-8 py-3 border-b border-ezGray text-sm text-ezGreen hover:text-ezGreen'
                    >
                      <AiOutlineLogout className='w-6 h-6 mr-5' /> Sign out
                    </button>
                    <div className='flex items-start justify-center w-full py-3'>
                      <Link
                        to='/privacy-policy'
                        className='block p-2 text-ezGreen hover:text-ezGreen text-xs hover:bg-ezLightGreen rounded-md'
                      >
                        Privacy Policy
                      </Link>
                      <span className=' text-ezGreen mx-2'>.</span>
                      <Link
                        to='/terms-and-conditions'
                        className='block p-2 text-ezGreen hover:text-ezGreen text-xs hover:bg-ezLightGreen rounded-md'
                      >
                        Terms & Conditions
                      </Link>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </Fragment>
  );
};

export default UserDropDown;
