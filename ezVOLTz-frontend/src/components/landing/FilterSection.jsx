import { Fade } from 'react-reveal';
import { androidUrl, animationProps, iosUrl } from 'helper/functionality';

const FilterSection = () => {
  return (
    <div className='w-full grid items-center grid-cols-1 gap-16 md:grid-cols-5 mb-16 md:mb-5 relative z-10'>
      <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center -z-10'>
        <img src='/assets/images/energy.png' alt='' className='w-80 h-auto ' />
      </div>
      <div className='order-1 ezFilterImg w-full flex justify-center md:col-span-2'>
        <Fade {...animationProps}>
          <img
            src='/assets/images/filterScreen.png'
            alt='Filter Screen'
            className='w-auto md:w-full mx-auto h-96 md:h-auto block '
          />
        </Fade>
      </div>
      <div className='order-0 md:order-1 ezFilterContent w-full block md:col-span-3'>
        <Fade {...animationProps}>
          <h2 className='text-ezBlack text-2xl sm:text-4xl font-bold mb-10'>
            Filter Your <br className='hidden sm:block' /> Chargers Based on
          </h2>
        </Fade>
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <Fade {...animationProps}>
            <div className='ezBaseCard w-full'>
              <span className='text-ezGreen text-base md:text-lg'>01</span>
              <p className='text-ezBlack text-xl'>Location</p>
            </div>
          </Fade>
          <Fade {...animationProps}>
            <div className='ezBaseCard w-full'>
              <span className='text-ezGreen text-base md:text-lg'>02</span>
              <p className='text-ezBlack text-xl'>Network</p>
            </div>
          </Fade>
          <Fade {...animationProps}>
            <div className='ezBaseCard w-full'>
              <span className='text-ezGreen text-base md:text-lg'>03</span>
              <p className='text-ezBlack text-xl'>Availability</p>
            </div>
          </Fade>
          <Fade {...animationProps}>
            <div className='ezBaseCard w-full'>
              <span className='text-ezGreen text-base md:text-lg'>04</span>
              <p className='text-ezBlack text-xl'>Connector Type</p>
            </div>
          </Fade>
        </div>
        <div className='appLinks mt-10'>
          <Fade {...animationProps}>
            <p className='text-ezBlack text-sm sm:text-xl mb-2'>
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
  );
};

export default FilterSection;
