import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { instanceNREL } from 'utls/instances';

const useNrelAxiosInterceotor = () => {
  const [isNrelLoading, setIsNrelLoading] = useState(false);

  useEffect(() => {
    const requestIntercept = instanceNREL.interceptors.request.use(
      (config) => {
        setIsNrelLoading(true);
        return config;
      },
      (error) => {
        toast.error(
          error?.response?.data?.error ||
            error?.response?.data?.errors?.[0] ||
            error.message
        );
        return error;
      }
    );

    const responseIntercept = instanceNREL.interceptors.response.use(
      function (response) {
        setIsNrelLoading(false);
        return response;
      },
      async function (error) {
        setIsNrelLoading(false);
        if (error?.code !== 'ERR_NETWORK')
          toast.error(
            error?.response?.data?.error ||
              error?.response?.data?.errors?.[0] ||
              error.message
          );
        return error;
      }
    );

    return () => {
      instanceNREL.interceptors.request.eject(requestIntercept);
      instanceNREL.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return { instanceNREL, isNrelLoading };
};

export default useNrelAxiosInterceotor;
