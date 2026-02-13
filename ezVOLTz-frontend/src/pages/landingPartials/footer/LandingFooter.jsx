import { androidUrl, iosUrl } from 'helper/functionality';
import { AiFillMail } from 'react-icons/ai';
import { BsFacebook, BsLinkedin, BsYoutube } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const navigation = {
  links: [
    {
      name: 'Our Website',
      href: 'https://ezvoltz.com/',
      internal: false,
    },
    {
      name: 'Contact Us',
      href: 'https://ezvoltz.com/contact-us/',
      internal: false,
    },
    { name: 'Download iOS app', href: iosUrl, internal: false },
    { name: 'Download Android app', href: androidUrl, internal: false },
    {
      name: 'Access the ezVOLTz Web version',
      href: '/login',
      internal: true,
    },
    {
      name: 'Signup for our newsletter',
      href: 'https://ezvoltz.com/contact-us/',
      internal: false,
    },
  ],
};

export default function LandingFooter() {
  return (
    <div className='bg-ezDarkGray z-10 pt-14'>
      <div className='mx-auto max-w-7xl px-6 pb-8 pt-16 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <Link to='/'>
            <img
              className='h-16'
              src='/assets/images/ezvoltzWhiteLogo.png'
              alt='Company Logo'
            />
          </Link>
          <div>
            <h3 className='text-base font-semibold leading-6 text-white'>
              Important Links
            </h3>
            <ul className='mt-6'>
              {navigation.links.map((item) => (
                <li key={item.name}>
                  {item?.internal ? (
                    <Link
                      to={item.href}
                      className='text-sm text-ezLightGray hover:text-white'
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-ezLightGray hover:text-white'
                    >
                      {item.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className='text-base font-semibold leading-6 text-white mb-6'>
              Contact
            </h3>
            <div className='flex items-center w-full mb-10'>
              <a
                href='mailto:info@ezvoltz.com'
                className='w-10 h-10 bg-ezGreen text-white hover:text-white mr-3 rounded-full flex items-center justify-center'
              >
                <AiFillMail className='w-5 h-5' />
              </a>
              <div className='content'>
                <p className='text-xs text-ezLightGray'>Email Address</p>
                <a
                  href='mailto:info@ezvoltz.com'
                  className='text-sm text-ezLightGray hover:text-white'
                >
                  info@ezvoltz.com
                </a>
              </div>
            </div>
            <ul className='flex items-start mt-6 space-x-4'>
              <a
                href='https://www.linkedin.com/company/ezvoltz'
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 rounded-full bg-white flex items-center justify-center'
              >
                <BsLinkedin className='w-5 h-5' />
              </a>
              <a
                href='https://www.facebook.com/ezvoltz'
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 rounded-full bg-white flex items-center justify-center'
              >
                <BsFacebook className='w-5 h-5' />
              </a>
              <a
                href='https://twitter.com/ezvoltzez'
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 rounded-full bg-white flex items-center justify-center'
              >
                <svg
                  width='18'
                  height='18'
                  viewBox='0 0 18 18'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M15 1L10 7.667M10 7.667L5.3 1.4C5.20685 1.2758 5.08607 1.175 4.94721 1.10557C4.80836 1.03614 4.65525 1 4.5 1H1L8 10.333M10 7.667L17 17H13.5C13.3448 17 13.1916 16.9639 13.0528 16.8944C12.9139 16.825 12.7931 16.7242 12.7 16.6L8 10.333M3 17L8 10.333'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </a>
              <a
                href='https://www.youtube.com/@ezvoltz'
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 rounded-full bg-white flex items-center justify-center'
              >
                <BsYoutube className='w-5 h-5' />
              </a>
            </ul>
          </div>
        </div>
        <div className='mt-8 border-t border-white/10 pt-8 md:flex md:items-center md:justify-between'>
          <div className='flex space-x-6 md:order-2 items-center justify-center'>
            <Link
              to='/privacy-policy'
              className='text-ezLightGray hover:text-white text-xs '
            >
              Privacy Policy
            </Link>
            <span className='text-ezLightGray'>|</span>
            <Link
              to='/terms-and-conditions'
              className='text-ezLightGray hover:text-white text-xs'
            >
              Terms and Conditions
            </Link>
          </div>
          <p className='mt-8 text-center md:text-left text-xs leading-5 text-ezLightGray md:order-1 md:mt-0'>
            &copy; Copyright 2023 ezVOLTz. All Rights Reserved. Solutionsloft
          </p>
        </div>
      </div>
    </div>
  );
}
