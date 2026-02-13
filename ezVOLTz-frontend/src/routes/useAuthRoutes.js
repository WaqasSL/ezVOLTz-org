import * as React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import ForgotPassword from 'pages/auth/forgotPassword/ForgotPassword';
import SignIn from 'pages/auth/signIn/SignIn';
import SignUp from 'pages/auth/signUp/SignUp';
import SetNewPassword from 'pages/auth/setNewPassword/SetNewPassword';
import DashboardLayout from 'pages/dashboard/DashboardLayout';
import VerifyAccount from 'pages/auth/verifyAccount/VerifyAccount';
import PrivacyPolicy from 'pages/auth/privacyPolicy/PrivacyPolicy';
import TermsAndConditions from 'pages/auth/termsAndConditions/TermsAndConditions';
import Landing from 'pages/Landing';
import ComingSoon from 'pages/comingSoon/ComingSoon';
import UserManual from 'pages/userManual/UserManual';
import PageNotFound from 'pages/notFound/PageNotFound';

const useAuthRoutes = () => {
  const routes = useRoutes([
    { path: '/', exact: true, element: <Navigate to="/home" /> },
    { path: '/user-manual', exact: true, element: <UserManual /> },
    { path: '/login', exact: true, element: <SignIn /> },
    { path: '/sign-up', exact: true, element: <SignUp /> },
    { path: '/forgot-password', exact: true, element: <ForgotPassword /> },
    { path: '/about-our-app', exact: true, element: <Landing /> },
    {
      path: '/verify-account/:token',
      exact: true,
      element: <VerifyAccount />,
    },
    {
      path: '/new-password/:token',
      exact: true,
      element: <SetNewPassword />,
    },
    {
      path: '/privacy-policy',
      exact: true,
      element: <PrivacyPolicy />,
    },
    {
      path: '/terms-and-conditions',
      exact: true,
      element: <TermsAndConditions />,
    },
    {
      path: '/coming-soon',
      exact: true,
      element: <ComingSoon />,
    },
    {
      path: '/page-not-found',
      exact: true,
      element: <PageNotFound />,
    },
    {
      path: '*',
      element: <DashboardLayout />,
    },
  ]);
  return routes;
};

export default useAuthRoutes;
