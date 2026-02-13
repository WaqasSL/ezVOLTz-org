import LocateChargers from 'components/userManual/LocateChargers';
import TripConfidence from 'components/userManual/TripConfidence';
import EzvoltzBetter from 'components/userManual/EzvoltzBetters';
import Layout from 'pages/Layout';
import { Fade } from 'react-reveal';
import { animationProps } from 'helper/functionality';
import { Link } from 'react-router-dom';
import UserManualFAQ from 'components/userManual/UserManualFAQ';

const UserManual = () => {
  return (
    <div className='ezUserManualPage z-20 relative bg-ezMidWhite'>
      <div className='block w-full pt-14 pb-32'>
        <div className='z-50 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <Fade {...animationProps}>
            <h1 className='text-4xl mb-10 text-white font-bold'>
              ezVOLTz App User Manual
            </h1>
          </Fade>
          <div className=' bg-white shadow-xl rounded-xl overflow-hidden px-6'>
            <LocateChargers />
            <TripConfidence />
            <EzvoltzBetter />
            <div className='ezHowKnow bg-ezGreen rounded-2xl p-8 my-10'>
              <div className='flex flex-col md:flex-row items-center md:justify-between'>
                <div className='content text-center md:text-left space-y-3'>
                  <Fade {...animationProps}>
                    <h3 className='text-white text-xl md:text-3xl font-bold'>
                      Find my next EV stop with{' '}
                      <br className='hidden md:block' /> ezVOLTz!
                    </h3>
                  </Fade>
                </div>
                <Fade {...animationProps}>
                  <Link
                    to='/home'
                    className='bg-ezBlack block px-5 py-3 rounded-md text-white hover:text-white text-sm mt-3 md:mt-0'
                  >
                    Access ezVOLTz Web app
                  </Link>
                </Fade>
              </div>
            </div>
            <UserManualFAQ />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout(UserManual);
