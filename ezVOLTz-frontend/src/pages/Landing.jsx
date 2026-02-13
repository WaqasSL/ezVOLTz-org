import Banner from 'components/landing/Banner';
import FilterSection from 'components/landing/FilterSection';
import HomePlanTrip from 'components/landing/HomePlanTrip';
import NavigationSection from 'components/landing/NavigationSection';
import RoadMap from 'components/landing/RoadMap';
import Layout from './Layout';

const Landing = () => {
  return (
    <div className='ezLandingPage z-20 relative'>
      <Banner />
      <div className='w-full py-10 md:py-14'>
        <div className='max-w-7xl mx-auto px-4 sm:px-8'>
          <FilterSection />
          <NavigationSection />
        </div>
      </div>
      <HomePlanTrip />
      <RoadMap />
    </div>
  );
};

export default Layout(Landing);
