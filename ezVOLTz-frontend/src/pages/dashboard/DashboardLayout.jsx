import PlanTrip from 'modals/planTrip/PlanTrip';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useProtectedRoutes from 'routes/useProtectedRoutes';
import Header from './partials/header/Header';
import Sidebar from './partials/sidebar/Sidebar';
import { useLocation } from 'react-router-dom';
import {
  handlPlanTripModal,
  handlSidebar,
} from 'redux/dashbbaord/dashboardSlice';
import GuestModal from 'modals/guest/GuestModal';
import { useJsApiLoader } from '@react-google-maps/api';
import { toggleLogin } from 'redux/auth/authSlice';
import { toast } from 'react-toastify';
import { sessionMessage } from 'helper/messages';
import PlanTripStepsModal from 'modals/planTripSteps/planTripStepsModal';
import NoTripModal from 'modals/noTrip/noTripModal';
import NoVehicleModal from 'modals/noVehicle/noVehicleModal';

const DashboardLayout = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });
  const { auth, dashboard } = useSelector((state) => state);
  const [isGuestModal, setIsGuestModal] = useState(false);
  const [isPlanTripModal, setIsPlanTripModal] = useState(false);
  const [isNoTripModal, setIsNoTripModal] = useState(false);
  const [isNoVehicleModal, setIsNoVehicleModal] = useState(false);
  const routes = useProtectedRoutes(auth?.userInfo);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!auth?.isLogin &&
        !auth?.userInfo?.accessToken &&
        window.location.pathname === '/home'
      ) {
      dispatch(
        toggleLogin({
          isLogin: true,
          userInfo: {
            user: {
              name: `Guest User`,
              isActive: false,
              role: 'guest',
            },
          },
        })
      );
      toast.success('Viewing as a guest.');
    }
  }, [auth?.isLogin]);

  useEffect(() => {
    if (
      auth?.isLogin &&
      !auth?.userInfo?.accessToken &&
      auth?.userInfo?.user?.role !== 'guest'
    ) {
      toast.info(sessionMessage);
      dispatch(toggleLogin({ isLogin: false, userInfo: null }));
      navigate('/login');
    }
  }, []);

  useEffect(() => {}, [dashboard?.isSidebar]);

  useEffect(() => {
    if (window?.innerWidth <= 1026) dispatch(handlSidebar(false));
    dispatch(handlPlanTripModal(false));
  }, [location]);

  return (
    <div className='ez__DashboardLayout relative w-full z-10'>
      {location?.pathname !== '/' &&
        location?.pathname !== '/page-not-found' && <Header />}
      <div className='ez__LayoutDiv relative flex flex-wrap w-full h-full'>
        {location?.pathname !== '/' &&
          location?.pathname !== '/page-not-found' && (
            <div
              className={`${
                dashboard?.isSidebar ? 'block' : 'hidden'
              } lg:block ez__Sidebar w-full bg-white h-full`}
            >
              <Sidebar 
                setIsGuestModal={setIsGuestModal} 
                setIsPlanTripModal={setIsPlanTripModal} 
                setIsNoTripModal={setIsNoTripModal}
                setIsNoVehicleModal={setIsNoVehicleModal}
              />
            </div>
          )}
        <div
          className={`${
            location?.pathname !== '/page-not-found' ? 'ez__LayoutPages' : ''
          } h-full bg-ezMidWhite`}
        >
          {auth?.isLogin && routes}
        </div>
        {location?.pathname !== '/' &&
          location?.pathname !== '/page-not-found' && <PlanTrip />}
        {isGuestModal && (
          <GuestModal
            isGuestModal={isGuestModal}
            setIsGuestModal={setIsGuestModal}
          />
        )}
        {isPlanTripModal && (
          <PlanTripStepsModal 
            isPlanTrip={isPlanTripModal}
            setIsPlanTripModal={setIsPlanTripModal}
          />
        )}
        {isNoTripModal && (
          <NoTripModal
            isNoTripModal={isNoTripModal}
            setIsNoTripModal={setIsNoTripModal}
          />
        )}
        {isNoVehicleModal && (
          <NoVehicleModal
            isNoVehicleModal={isNoVehicleModal}
            setIsNoVehicleModal={setIsNoVehicleModal}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
