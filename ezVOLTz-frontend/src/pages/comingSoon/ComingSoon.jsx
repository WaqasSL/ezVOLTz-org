import { androidUrl, iosUrl } from 'helper/functionality';
import Layout from 'pages/Layout';

const ComingSoon = () => {
  return (
    <div className='max-w-5xl mx-auto block w-full px-8 py-32'>
      <div className='flex items-center justify-center flex-col'>
        <img
          src='/assets/images/charger.png'
          alt='Charger'
          className='w-56 h-auto block'
        />
        <h1 className='text-ezGray ezComingSoonHeading font-bold text-4xl md:text-7xl text-center mb-5'>
          Coming Soon
        </h1>
        <p className='text-ezBlack text-base text-center mb-10'>
          Our User Manual Page is currently under construction and will soon be
          launched. Stay tuned for the unveiling of our comprehensive user
          guide, packed with detailed instructions to enhance your experience.
          We can't wait to share it with you!
        </p>
        <div className='appLinks w-full flex items-center justify-center flex-col'>
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
        </div>
      </div>
    </div>
  );
};

export default Layout(ComingSoon);
