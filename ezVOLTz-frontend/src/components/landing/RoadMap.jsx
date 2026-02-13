import { Fade } from 'react-reveal';
import { androidUrl, animationProps, iosUrl } from 'helper/functionality';
import { Link } from 'react-router-dom';

const RoadMap = () => {
  return (
    <div className='w-full ezRoadMap block'>
      <div
        className='roadMapLineBg w-full py-10 md:pt-10 md:pb-28'
        style={{
          background:
            'url(/assets/images/roadMapLinesBg.png) no-repeat bottom/cover',
        }}
      >
        <div className='max-w-7xl mx-auto px-4'>
          <div className='title flex flex-col md:flex-row md:items-center md:px-20'>
            <Fade {...animationProps}>
              <h2 className='text-ezBlack uppercase text-6xl md:text-8xl font-bold'>
                <b className='block text-2xl'>Get on the</b> Road
              </h2>
            </Fade>
            <Fade {...animationProps}>
              <p className='text-ezBlack text-base md:text-xl md:ml-10 md:mt-8'>
                ezVOLTz lets you plan a trip with confidence
              </p>
            </Fade>
          </div>
          <div className='ezRoadImg'>
            <Fade {...animationProps}>
              <img
                src='/assets/svgs/roadMap.svg'
                alt='Road Map'
                className='w-full h-auto my-10'
              />
            </Fade>
          </div>
          <div className='appLinks md:-mt-36'>
            <Fade {...animationProps}>
              <p className='text-ezBlack text-sm sm:text-base mb-2'>
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
      <div className='roadMapBg w-full relative'>
        <div
          className='roadMapInnerBg block w-full -m-2'
          style={{
            background:
              'linear-gradient(rgba(34,139,34,0.8), rgba(34,139,34,0.8)), url(/assets/images/stationBg.jpg) no-repeat bottom/cover',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className='block max-w-6xl mx-auto px-4'>
            <img
              src='/assets/images/phones.png'
              alt='Phones'
              className='w-full h-auto mx-auto block'
            />
          </div>
        </div>
      </div>
      <div className='max-w-7xl mx-auto px-4 sm:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-16 items-center pb-32'>
          <div className='title md:col-span-2'>
            <Fade {...animationProps}>
              <h6 className='text-ezGreen text-base lg:text-xl lg:mb-3'>
                About Us
              </h6>
            </Fade>
            <Fade {...animationProps}>
              <h3 className='text-ezBlack font-bold text-3xl lg:text-5xl'>
                ezVOLTz
              </h3>
              <h3 className='text-ezGray text-xl md:text-2xl'>
                True EV Freedom
              </h3>
            </Fade>
          </div>
          <Fade {...animationProps}>
            <div className='content md:col-span-3 text-sm sm:text-base text-ezBlack space-y-5 h-56 overflow-y-auto'>
              <p>
                {`ezVOLTz™ is an innovative EV Charging as a Service company that
              provides a comprehensive, cloud-based, centralized,
              interconnected, and optimized enterprise grade EV Charging
              Management Solution. Combined with our ezVOLTz app, which reduces
              Range Anxiety by showing all available charging stations nearby
              and on your trip, we’re changing the course of America’s EV
              future. Find your station, get directions, and get back on the
              road!`}
              </p>
              <p>{`At ezVOLTz™, we are building an EV Charging universe that is accessible and connected for all drivers, fleet operators, and local jurisdictions. We position ourselves as an integrator so that states and cities don’t have to be locked in with one Electric Vehicle Supply Equipment (EVSE) vendor and can do business with any independent provider allowing more autonomy, flexibility and supply chain resiliency in their EV charging infrastructure. We are hardware agnostic and work with all industry leading EVSE manufacturers. ezVOLTz™ provides an optimized, centralized and interconnected platform that enables large enterprise organizations and government fleets to effectively manage their EV charging programs and EV powered investments.`}</p>
              <p>
                Our ability to manage charging capacity, schedule resources,
                provide dynamic load sharing and adaptation along with
                end-to-end user cost management provides a unique capability to
                optimize scarce charging resources.
              </p>
            </div>
          </Fade>
        </div>
        <div className='ezHowKnow bg-ezGreen rounded-2xl p-8 -mb-20'>
          <div className='flex flex-col md:flex-row items-center md:justify-between'>
            <div className='content text-center md:text-left space-y-3'>
              <Fade {...animationProps}>
                <h3 className='text-white text-xl md:text-3xl font-bold'>
                  Want to know how to use ezVOLTz?
                </h3>
                <p className='text-white text-opacity-70 text-sm md:text-base'>
                  Access our User Manual and FAQs
                </p>
              </Fade>
            </div>
            <Fade {...animationProps}>
              <Link
                to='/user-manual'
                className='bg-ezBlack block px-5 py-3 rounded-md text-white hover:text-white text-sm mt-3 md:mt-0'
              >
                ezVOLTz User Manual
              </Link>
            </Fade>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadMap;
