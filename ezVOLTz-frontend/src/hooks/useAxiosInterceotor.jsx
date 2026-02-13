import { sessionMessage } from 'helper/messages';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { toggleLogin } from 'redux/auth/authSlice';
import { getRefreshToken } from 'utls/apiCalls/authApi';
import { instance } from 'utls/instances';

const useAxiosInterceotor = () => {
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const requestIntercept = instance.interceptors.request.use(
      (config) => {
        if (
          auth?.isLogin &&
          !auth?.userInfo?.accessToken &&
          auth?.userInfo?.user?.role !== 'guest'
        ) {
          toast.info(sessionMessage);
          dispatch(toggleLogin({ isLogin: false, userInfo: null }));
          return navigate('/login');
        }
        setIsApiLoading(true);
        config.headers['retryCall'] = 1;
        if (!config.headers['Authorization']) {
          config.headers[
            'Authorization'
          ] = `Bearer ${auth?.userInfo?.accessToken}`;
        }
        return config;
      },
      (error) => {
        setIsApiLoading(false);
        toast.error(error?.response?.data?.error || error.message);
        return error;
      }
    );

    const responseIntercept = instance.interceptors.response.use(
      function (response) {
        setIsApiLoading(false);
        return response;
      },
      async function (error) {
        setIsApiLoading(false);
        const prevRequest = error.config;
        if (
          !error?.response?.data?.error?.message?.includes('jwt') &&
          error?.response?.status === 403 &&
          !prevRequest.sent
        ) {
          prevRequest.sent = true;
          const result = await getRefreshToken({
            userInfo: auth?.userInfo,
            dispatch,
          });
          prevRequest.headers[
            'Authorization'
          ] = `Bearer ${result?.data?.accessToken}`;
          return instance(prevRequest);
        }
        if (error?.response?.data?.error?.message?.includes('jwt')) {
          prevRequest.sent = true;
          const result = await getRefreshToken({
            userInfo: auth?.userInfo,
            dispatch,
          });
          prevRequest.headers[
            'Authorization'
          ] = `Bearer ${result?.data?.accessToken}`;
          return instance(prevRequest);
        }
        if (error?.response?.data?.error?.message?.includes('jwt')) {
          toast.info(sessionMessage);
          dispatch(toggleLogin({ isLogin: false, userInfo: null }));
          return navigate('/login');
        }
        if (+prevRequest.headers['retryCall'] === 1)
          toast.error(error?.response?.data?.error || error.message);
        prevRequest.headers['retryCall'] = 2;
        return error;
      }
    );

    return () => {
      setIsApiLoading(false);
      instance.interceptors.request.eject(requestIntercept);
      instance.interceptors.response.eject(responseIntercept);
    };
  }, [auth]);

  return { instance, isApiLoading };
};

export default useAxiosInterceotor;
