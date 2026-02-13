import { Disclosure } from '@headlessui/react';
import { MdOutlineCancel } from 'react-icons/md';
import { BsBookmarkPlus, BsGlobe } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineBell } from 'react-icons/ai';
import UserDropDown from './UserDropDown';
import { useDispatch, useSelector } from 'react-redux';
import { handlSidebar } from 'redux/dashbbaord/dashboardSlice';
import { toggleLogin } from 'redux/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import HeaderPlacesInput from './HeaderPlacesInput';
import React from 'react';

function Header() {
  const navigate = useNavigate();
  const { dashboard, auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(toggleLogin({ isLogin: false, userInfo: null }));
    navigate('/login');
  };

  return (
    <Disclosure as='nav' className='bg-white ez__Header z-10'>
      {({ open }) => (
        <>
          <div className='w-full px-2 sm:px-6 lg:px-14'>
            <div className='relative flex h-16 items-center justify-between'>
              <div className='flex flex-1 items-center justify-between lg:justify-start'>
                <div className='flex items-center lg:hidden'>
                  <Disclosure.Button
                    onClick={() =>
                      dispatch(handlSidebar(!dashboard?.isSidebar))
                    }
                    className='inline-flex items-center justify-center rounded-md p-2 text-base text-ezGray focus:outline-none'
                  >
                    <span className='sr-only'>Open main menu</span>
                    {dashboard?.isSidebar ? (
                      <MdOutlineCancel className='block h-6 w-6' />
                    ) : (
                      <GiHamburgerMenu className='block h-6 w-6' />
                    )}
                  </Disclosure.Button>
                </div>
                <a
                  href='https://www.ezvoltz.com'
                  className='flex flex-shrink-0 items-center'
                >
                  <img
                    className='block h-6 sm:h-12 w-auto'
                    src='/assets/images/ezvoltzLogo.png'
                    alt='Your Company'
                  />
                </a>
                <div className='hidden mx-auto lg:block'>
                  <HeaderPlacesInput />
                </div>
                <div className='block lg:hidden'>
                  <UserDropDown
                    userInfo={auth?.userInfo}
                    handleLogout={handleLogout}
                  />
                </div>
              </div>
              <div className='absolute inset-y-0 right-0 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0  hidden lg:flex'>
                <button
                  type='button'
                  className='p-2  text-ezGreen font-semibold focus:outline-none'
                >
                  <BsGlobe className='h-5 w-5' aria-hidden='true' />
                </button>
                <span className=' bg-gray-200 h-7 w-px mx-2 lg:mx-5 block'></span>
                <button
                  type='button'
                  className='p-2 text-ezGreen  font-semibold focus:outline-none block'
                >
                  <BsBookmarkPlus className='h-5 w-5' aria-hidden='true' />
                </button>
                <span className=' bg-gray-200 h-7 w-px mx-2 lg:mx-5 block'></span>
                <button
                  type='button'
                  className='p-2 text-ezGreen  font-semibold focus:outline-none block'
                >
                  <AiOutlineBell className='h-6 w-6' aria-hidden='true' />
                </button>
                <span className=' bg-gray-200 h-7 w-px mx-2 lg:mx-5 block'></span>
                <UserDropDown
                  userInfo={auth?.userInfo}
                  handleLogout={handleLogout}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}

export default Header;
