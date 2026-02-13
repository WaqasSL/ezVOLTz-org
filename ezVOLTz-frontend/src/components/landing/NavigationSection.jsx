import { Fade } from 'react-reveal';
import { androidUrl, animationProps, iosUrl } from 'helper/functionality';

const NavigationSection = () => {
  return (
    <div className='w-full grid items-center grid-cols-1 md:grid-cols-5 gap-16 md:gap-0 mt-20'>
      <div className='ezNavigateContent z-0 w-full block md:col-span-3 relative'>
        <img
          src='/assets/images/navigateBg.png'
          alt='Navigation'
          className='navigateImg -z-10 hidden md:block'
        />
        <div className='content bg-white z-10'>
          <Fade {...animationProps}>
            <h2 className='text-ezBlack text-2xl md:text-4xl font-bold mb-5 '>
              Navigate to your selected charger
            </h2>
          </Fade>
          <Fade {...animationProps}>
            <p className='text-ezBlack text-sm sm:text-lg mb-5'>
              Select a charger from the map and get directions.
            </p>
          </Fade>
          <div className='appLinks mt-10'>
            <Fade {...animationProps}>
              <p className='text-ezBlack text-sm sm:text-lg mb-2'>
                Download the free ezVOLTz app
              </p>
              <div className='flex items-center space-x-4'>
                <a
                  href={androidUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-auto h-8 md:h-10 rounded-md overflow-hidden'
                >
                  <img
                    src='/assets/images/googleBtn.png'
                    alt='Google'
                    className='w-auto h-full'
                  />
                </a>
                <a
                  href={iosUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-auto h-8 md:h-10 rounded-md overflow-hidden'
                >
                  <img
                    src='/assets/images/appleBtn.png'
                    alt='Google'
                    className='w-auto h-full'
                  />
                </a>
              </div>
            </Fade>
          </div>
        </div>
      </div>
      <div className='ezFilterImg w-full flex justify-center md:col-span-2'>
        <Fade {...animationProps}>
          <img
            src='/assets/images/navigateImg.png'
            className='w-auto md:w-full mx-auto md:ml-0 h-96 md:h-auto block'
            alt='Filter Screen'
          />
        </Fade>
      </div>
    </div>
  );
};

export default NavigationSection;
