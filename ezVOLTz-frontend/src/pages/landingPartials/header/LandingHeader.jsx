import { Disclosure } from '@headlessui/react';
import { MdOutlineCancel } from 'react-icons/md';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function LandingHeader() {
  const { auth } = useSelector((state) => state);
  return (
    <Disclosure
      as='nav'
      className='bg-white shadow-md border-b border-ezLightGray'
    >
      {({ open }) => (
        <>
          <div
            className={`${
              open && 'border-ezLightGray'
            } mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-b py-3`}
          >
            <div className='flex h-16 items-center justify-between'>
              <div className='flex items-center'>
                <Link to='/' className='flex-shrink-0'>
                  <img
                    className='block h-10 sm:h-14 w-auto'
                    src='/assets/images/ezvoltzLogo.png'
                    alt='Your Company'
                  />
                </Link>
              </div>
              <div className='hidden md:ml-6 md:flex items-center'>
                <div className='ml-6 flex items-center'>
                  <Link
                    to='/home'
                    className='text-ezBlack  hover:text-ezGreen text-xs lg:text-base block px-2 lg:px-4 border-ezBlack border-r'
                  >
                    Find A Station
                  </Link>
                  <a
                    href='https://ezvoltz.com/contact-us/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-ezBlack  hover:text-ezGreen text-xs lg:text-base block px-2 lg:px-4 border-ezBlack border-r'
                  >
                    Connect with us
                  </a>
                  <a
                    href='http://www.ezvoltz.com/about-us/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-ezBlack  hover:text-ezGreen text-xs lg:text-base block px-2 lg:px-4 border-ezBlack border-r'
                  >
                    About us
                  </a>
                  <Link
                    to='/user-manual'
                    className='text-ezBlack  hover:text-ezGreen text-xs lg:text-base block px-2 lg:px-4 border-ezBlack border-r'
                  >
                    User Manual
                  </Link>
                  <a
                    href='https://ezvoltz-assets.s3.ap-northeast-1.amazonaws.com/pressRelease.pdf'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-ezBlack  hover:text-ezGreen text-xs lg:text-base block px-2 lg:px-4'
                  >
                    Press Release
                  </a>
                </div>
              </div>
              <div className='-mr-2 flex md:hidden'>
                <Disclosure.Button className='relative inline-flex items-center justify-center p-2 text-ezBlack'>
                  {open ? (
                    <MdOutlineCancel className='block h-7 w-7' />
                  ) : (
                    <GiHamburgerMenu className='block h-7 w-7' />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className='sm:hidden'>
            <div className='space-y-1 px-2 pb-3 pt-2 '>
              {auth?.isLogin && (
                <Link
                  to='/home'
                  className='text-ezBlack  hover:text-ezGreen text-base block py-4 border-ezBlack border-b'
                >
                  Find A Station
                </Link>
              )}
              <a
                href='https://ezvoltz.com/contact-us/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-ezBlack  hover:text-ezGreen text-base block py-4 border-ezBlack border-b'
              >
                Connect with us
              </a>
              <a
                href='http://www.ezvoltz.com/about-us/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-ezBlack  hover:text-ezGreen text-base block py-4 border-ezBlack border-b'
              >
                About us
              </a>
              <Link
                to='/user-manual'
                className='text-ezBlack  hover:text-ezGreen text-base block py-4 border-ezBlack border-b'
              >
                User Manual
              </Link>
              <a
                href='https://ezvoltz-assets.s3.ap-northeast-1.amazonaws.com/pressRelease.pdf'
                target='_blank'
                rel='noopener noreferrer'
                className='text-ezBlack  hover:text-ezGreen text-base block py-4'
              >
                Press Release
              </a>
              {!auth?.isLogin && (
                <Link
                  to='/login'
                  className=' text-white border border-ezGreen hover:bg-white hover:text-ezGreen bg-ezGreen rounded-md text-base block  px-5 py-2'
                >
                  Sign in
                </Link>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
