import React, {useEffect, useState, useRef} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {Platform} from 'react-native';

import AuthenticationStack from './AuthenticationStack';
import {clearFilter} from '../redux/slices/filter/slice';
import {clearByBound} from '../redux/slices/byBound/slice';
import {
  notificationListener,
  requestUserPermission,
} from '../utils/notificationHandler';
import useSaasApiHook from '../hooks/saas/useSaasApi';
import {navigationRef} from '../utils/navigationHandler';
import {isEmpty, isNull} from 'lodash';
import {clearAds} from '../redux/slices/ads/slice';
import {
  setIsWebHookCall,
  setSaasChargeDetails,
} from '../redux/slices/saasCharge/slice';
import useApiHook from '../hooks/rest/useApi';
import {showSnackSuccess} from '../utils/functions';
import moment from 'moment';

const AppNavigation = () => {
  const dispatch = useDispatch();
  const {auth, saasCharge} = useSelector(state => state);
  const {handleSaasApi} = useSaasApiHook();
  const {handleRestApi, restApiLoading} = useApiHook();

  const USER_ID = auth?.user?._id;
  const token = auth?.accessToken;

  let ISGUEST;
  ISGUEST = isEmpty(auth.user);
  ISGUEST = isNull(auth.refreshToken);

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const startTransaction = async res => {
    const data = {
      idTag: res?.[0]?.idTag,
      transactionPk: res?.[0]?.transactionId,
      startTime: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    };

    console.log('datadata', data);
    const response = await handleRestApi({
      method: `post`,
      url: `charging/transaction-started`,
      headers: {
        'API-KEY':
          '$2a$10$AWcHXvDRKGbBnKOSjPw5LeSGQykkL.Alm.UmqzwyT.6nUt5V51JYa',
      },
      data: data,
    });

    if (response.status === 200) {
      dispatch(setIsWebHookCall(true));
    }
  };

  const cancelPreparing = async item => {
    setIsDataLoaded(true);

    const data = {
      chargerId: saasCharge?.preparingId,
      userId: USER_ID,
    };
    const response = await handleRestApi({
      method: `post`,
      url: `charger/cancel-charging`,
      data,
    });

    if (response.status === 200) {
      dispatch(setSaasChargeDetails(null));
      showSnackSuccess(response?.data?.message);
    }
  };

  const liveTransactions = async () => {
    if (isNull(saasCharge.connectorPk)) return;
    console.log('call');
    try {
      const response = await handleSaasApi({
        method: 'get',
        url: `livetransactions/${saasCharge.connectorPk}`,
      });

      if (response.status === 200) {
        const hasTransactionID = response?.data?.some(
          activity => activity?.transactionId,
        );
        console.log('=====================>>>>>>>>>', hasTransactionID);

        if (hasTransactionID) {
          dispatch(setSaasChargeDetails(null));
          startTransaction(response?.data);
          clearInterval(intervalRef.current);
          clearTimeout(timeoutRef.current);
        }
      }
    } catch (error) {
      console.error('Error fetching charging activities:', error);
    }
  };

  useEffect(() => {
    if (token) {
      requestUserPermission();
      notificationListener();
    }
  }, [token]);

  useEffect(() => {
    if (!ISGUEST) {
      if (!isNull(saasCharge.connectorPk)) {
        intervalRef.current = setInterval(liveTransactions, 20000);

        timeoutRef.current = setTimeout(() => {
          clearInterval(intervalRef.current);
          dispatch(setSaasChargeDetails(null));
          cancelPreparing();
          console.log('Polling stopped due to timeout');
        }, 600000);

        liveTransactions();

        return () => {
          clearInterval(intervalRef.current);
          clearTimeout(timeoutRef.current);
        };
      }
    }
  }, [saasCharge.connectorPk, token]);

  useEffect(() => {
    dispatch(clearFilter());
    // dispatch(clearByBound());
    dispatch(clearAds());
  }, [dispatch]);

  return (
    <NavigationContainer ref={navigationRef}>
      <AuthenticationStack />
    </NavigationContainer>
  );
};

export default AppNavigation;
