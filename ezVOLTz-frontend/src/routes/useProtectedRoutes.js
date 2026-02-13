import * as React from 'react';
import { Navigate, Route, Routes, useRoutes } from 'react-router-dom';
import Home from 'pages/dashboard/Home';
import MyTrip from 'pages/dashboard/myTrip/MyTrip';
import PreviousTripDetail from 'pages/dashboard/previousTrip/PreviousTripDetail';
import UpcomingTripDetail from 'pages/dashboard/upcomingTrip/UpcomingTripDetail';
import MyVehicle from 'pages/dashboard/myVehicle/MyVehicle';
import InProgressTripDetail from 'pages/dashboard/inProgressTrip/InProgressTripDetail';
import ContactUs from 'pages/dashboard/contactUs/ContactUs';
import FAQ from 'pages/dashboard/faq/FAQ';
import Feedback from 'pages/dashboard/feedback/Feedback';
import Landing from 'pages/Landing';
import ComingSoon from 'pages/comingSoon/ComingSoon';
import UserManual from 'pages/userManual/UserManual';
import Profile from 'pages/dashboard/profile/Profile';
import { checkUserAuthenticated } from 'helper/functionality';
import ChargingActivity from 'pages/dashboard/chargingActivity/ChargingActivity';
import MyPayment from 'pages/dashboard/myPayment/MyPayment';

const useProtectedRoutes = (userInfo) => {
  const isUserAuthenticated = checkUserAuthenticated(userInfo);

  const routes = useRoutes([
    { path: '/', exact: true, element: <Navigate to="/home" /> },
    { path: '/home', exact: true, element: <Home /> },
    { path: '/user-manual', exact: true, element: <UserManual /> },
    { 
      path: '/about-our-app', 
      exact: true, 
      element: <Landing /> 
    },
    {
      path: '/coming-soon',
      exact: true,
      element: <ComingSoon />,
    },
    {
      path: '/profile',
      exact: true,
      element: isUserAuthenticated ? (
        <Profile />
      ) : (
        <Navigate to='/home' replace={true} />
      ),
    },
    {
      path: '/my-trips',
      exact: true,
      element: isUserAuthenticated ? (
        <MyTrip />
      ) : (
        <Navigate to='/home' replace={true} />
      ),
    },
    { path: '/feedback', exact: true, element: <Feedback /> },
    {
      path: '/previous-trip/detail/:tripId',
      exact: true,
      element: isUserAuthenticated ? (
        <PreviousTripDetail />
      ) : (
        <Navigate to='/home' replace={true} />
      ),
    },
    {
      path: '/upcoming-trip/detail/:tripId',
      exact: true,
      element: isUserAuthenticated ? (
        <UpcomingTripDetail />
      ) : (
        <Navigate to='/home' replace={true} />
      ),
    },
    {
      path: '/inprogress-trip/detail/:tripId',
      exact: true,
      element: isUserAuthenticated ? (
        <InProgressTripDetail />
      ) : (
        <Navigate to='/home' replace={true} />
      ),
    },
    {
      path: '/my-vehicles',
      exact: true,
      element: isUserAuthenticated ? (
        <MyVehicle />
      ) : (
        <Navigate to='/home' replace={true} />
      ),
    },
    {
      path: '/charging-activity',
      exact: true,
      element: isUserAuthenticated ? (
        <ChargingActivity />
      ) : (
        <Navigate to='/home' replace={true} />
      ),
    },
    {
      path: '/my-payment-methods',
      exact: true,
      element: isUserAuthenticated ? (
        <MyPayment />
      ) : (
        <Navigate to='/home' replace={true} />
      ),
    },
    {
      path: '/contact-us',
      exact: true,
      element: <ContactUs />,
    },
    {
      path: '/faq',
      exact: true,
      element: <FAQ />,
    },
    {
      path: '*',
      element: (
        <Routes>
          <Route path='/login' element={<Navigate to='/login' />} />
          <Route path='/sign-up' element={<Navigate to='/sign-up' />} />
          <Route path='*' element={<Navigate to='/page-not-found' />} />
        </Routes>
      ),
    },
  ]);
  return routes;
};

export default useProtectedRoutes;
