import { Fade } from 'react-reveal';
import { androidUrl, animationProps, iosUrl } from 'helper/functionality';
import BannerCarousel from './BannerCarousel';

const Banner = () => {
  return (
    <div className='ezBanner block w-full py-14'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-4 w-full items-center'>
          <div className='ezBannerContent w-full block md:col-span-2'>
            <Fade {...animationProps}>
              <h1 className='text-white text-2xl md:text-4xl font-bold mb-5'>
                ezVOLTz App
              </h1>
              <p className='text-white text-xl md:text-2xl  mb-5'>
                EV Charging Station Locator
              </p>
            </Fade>
            <Fade {...animationProps}>
              <p className='text-white text-sm sm:text-base mb-5'>
                Our free ezVOLTz driver navigation app offers a revolutionary
                way to find your next EV charging station with a directory of
                ALL charging options across the USA.
              </p>
            </Fade>
            <Fade {...animationProps}>
              <ul className='text-white text-sm sm:text-base space-y-4 bannerUl'>
                <li>Find your next station</li>
                <li>
                  Use our smart filters to narrow your search to stations you
                  want to find, like those that match your vehicle, or are
                  nearby
                </li>
                <li>Check to see if your station is available or in-service</li>
                <li>
                  Plan a trip with confidence, add stops along your route, and
                  get turn-by-turn navigation
                </li>
              </ul>
            </Fade>
            <Fade {...animationProps}>
              <div className='appLinks mt-10'>
                <p className='text-white text-sm sm:text-base mb-2'>
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
              </div>
            </Fade>
          </div>
          <div className='ezBannerCarousel w-full relative md:col-span-3'>
            <Fade {...animationProps}>
              <BannerCarousel />
            </Fade>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
