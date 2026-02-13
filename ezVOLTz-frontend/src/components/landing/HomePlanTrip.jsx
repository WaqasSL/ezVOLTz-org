import { Fade } from 'react-reveal';
import {
  androidUrl,
  animationProps,
  iosUrl,
  planTripSteps,
} from 'helper/functionality';

export default function HomePlanTrip() {
  return (
    <div className='ezHomePlanTrip bg-white pt-10 pb-20'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='flex items-center flex-col mb-10'>
          <Fade {...animationProps}>
            <h3 className='mt-2 text-4xl font-bold text-ezBlack sm:text-5xl mb-3'>
              Plan a Trip
            </h3>
          </Fade>
          <Fade {...animationProps}>
            <p className='text-ezBlack text-center text-sm sm:text-xl mb-5'>
              Use ezVOLTz to plan your trip anywhere in the USA and eliminate
              Range Anxiety!
            </p>
          </Fade>
        </div>
        <div className='grid w-full grid-cols-1 sm:mx-auto md:grid-cols-3 gap-10 md:gap-0 mb-14'>
          {planTripSteps.map((step) => (
            <div key={step?.step} className='flex items-center flex-col'>
              <Fade {...animationProps} duration={1000 * step?.step}>
                <h3 className='text-5xl font-semibold text-ezLightGray'>
                  {step?.step}
                </h3>
                <p className='text-base text-ezGreen mb-5'>{step?.title}</p>
                <img
                  src={step?.imageUrl}
                  alt='Steps'
                  className='w-auto md:w-3/4 h-96 md:h-auto'
                />
              </Fade>
            </div>
          ))}
        </div>
        <div className='appLinks flex items-center w-full flex-col'>
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
}
