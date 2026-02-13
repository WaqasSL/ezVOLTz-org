import {
  androidUrl,
  animationProps,
  iosUrl,
  navigateFilterSteps,
} from 'helper/functionality';
import { Fade } from 'react-reveal';

const LocateChargers = () => {
  return (
    <div className='ezHomePlanTrip pt-10 pb-20'>
      <div className='flex items-center flex-col mb-14 text-center max-w-3xl mx-auto'>
        <Fade {...animationProps}>
          <h3 className='mt-2 text-2xl md:text-3xl font-bold text-ezBlack sm:text-4xl mb-3'>
            How to Locate the Closest EV Chargers and Navigate with ezVOLTz
          </h3>
        </Fade>
        <Fade {...animationProps}>
          <p className='text-ezBlack text-center text-sm sm:text-xl mb-5'>
            {`It’s EZ to use the ezVOLTz App!`}
          </p>
        </Fade>
        <Fade {...animationProps}>
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
      <div className='grid w-full grid-cols-1 sm:grid-cols-2 sm:mx-auto md:grid-cols-4 gap-10 mb-14'>
        {navigateFilterSteps.map((step) => (
          <div key={step?.step} className='flex items-center flex-col'>
            <Fade {...animationProps} duration={1000 * step?.step}>
              <h3 className='text-5xl font-semibold text-ezLightGray'>
                {step?.step}
              </h3>
              <p className='text-base sm:text-xs lg:text-base text-ezGreen mb-5'>
                {step?.title}
              </p>
              <img
                src={step?.imageUrl}
                alt='Steps'
                className='w-auto md:w-full h-96 md:h-auto'
              />
            </Fade>
          </div>
        ))}
      </div>
      <div className='bg-ezLightWhite rounded-xl px-5 py-10 md:p-10'>
        <Fade {...animationProps}>
          <h2 className='text-ezBlack text-xl md:text-2xl font-bold mb-5'>
            How to Locate the Closest EV Chargers and Navigate with ezVOLTz
          </h2>
        </Fade>
        <ul className='list-decimal list-inside block text-ezBlack space-y-3'>
          <Fade {...animationProps}>
            <li>
              Open the ezVOLTz app and the map will load.
              <ol className='block text-ezBlack space-y-1 lowerAlpha list-inside pl-5'>
                <li>
                  Click on{' '}
                  <img
                    src='/assets/svgs/icons/setting.svg'
                    alt=''
                    className='w-6 h-auto inline-block mx-1'
                  />{' '}
                  to select viewing range (25-100 miles). Click on “Next”.
                </li>
                <li>
                  Click on{' '}
                  <img
                    src='/assets/svgs/icons/gps.svg'
                    alt=''
                    className='w-6 h-auto inline-block mx-1'
                  />{' '}
                  to see EV charging stations nearby.
                </li>
                <li>
                  Your current location is marked with a pin.{' '}
                  <img
                    src='/assets/svgs/icons/redPin.svg'
                    alt=''
                    className='w-6 h-auto inline-block mx-1'
                  />
                </li>
                <li>
                  OR search at the top bar and enter a location to find
                  available EV charging stations.
                </li>
                <li>
                  Toggle between list view{' '}
                  <img
                    src='/assets/svgs/icons/menu.svg'
                    alt=''
                    className='w-6 h-auto inline-block mx-1'
                  />{' '}
                  and pin view.{' '}
                  <img
                    src='/assets/svgs/icons/blackPin.svg'
                    alt=''
                    className='w-6 h-auto inline-block mx-1'
                  />
                </li>
              </ol>
            </li>
          </Fade>
          <Fade {...animationProps}>
            <li>
              Filters - click on{' '}
              <img
                src='/assets/svgs/icons/blackHamBurger.svg'
                alt=''
                className='w-6 h-auto inline-block mx-1'
              />{' '}
              to find only what you need.
              <ol className='block text-ezBlack space-y-1 lowerAlpha list-inside pl-5'>
                <li>
                  Filter by network, connector, public/private, fuel type, AC/DC
                  level.
                </li>
                <li>
                  You can even limit your search to electric, hydrogen, propane,
                  or diesel.
                </li>
                <li>After selecting your filters, click on “Apply Filters”.</li>
              </ol>
            </li>
          </Fade>
          <Fade {...animationProps}>
            <li>
              Add your vehicle - Click on{' '}
              <img
                src='/assets/svgs/icons/hamBurger.svg'
                alt=''
                className='w-6 h-auto inline-block mx-1'
              />{' '}
              to select My Vehicle and add your specs and your own filters
              manually.
            </li>
          </Fade>
          <Fade {...animationProps}>
            <li>
              Drive! Get directions by clicking on the{' '}
              <img
                src='/assets/svgs/icons/navigate.svg'
                alt=''
                className='w-6 h-auto inline-block mx-1'
              />{' '}
              green navigation icon ext to your selected station address.{' '}
            </li>
          </Fade>
        </ul>
      </div>
    </div>
  );
};

export default LocateChargers;
