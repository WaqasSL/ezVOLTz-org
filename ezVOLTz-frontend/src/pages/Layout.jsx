import LandingFooter from './landingPartials/footer/LandingFooter';
import LandingHeader from './landingPartials/header/LandingHeader';

const Layout = (Component) => (props) => {
  return (
    <div className='ez__AppLayout relative w-full z-10'>
      <LandingHeader />
      <Component {...props} />
      <LandingFooter />
    </div>
  );
};

export default Layout;
