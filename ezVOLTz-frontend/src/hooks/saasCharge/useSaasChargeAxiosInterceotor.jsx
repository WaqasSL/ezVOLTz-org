import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { instanceSassCharge } from 'utls/instances';

const useSaasChargeAxiosInterceotor = () => {
  const [isSassLoading, setIsSassLoading] = useState(false);
  useEffect(() => {
    const requestIntercept = instanceSassCharge.interceptors.request.use(
      (config) => {
        setIsSassLoading(true);
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

    const responseIntercept = instanceSassCharge.interceptors.response.use(
      function (response) {
        setIsSassLoading(false);
        return response;
      },
      function (error) {
        setIsSassLoading(false);
        toast.error(
          error?.response?.data?.error ||
            error?.response?.data?.errors?.[0] ||
            error.message
        );
        return error;
      }
    );

    return () => {
      instanceSassCharge.interceptors.request.eject(requestIntercept);
      instanceSassCharge.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return { instanceSassCharge, isSassLoading };
};

export default useSaasChargeAxiosInterceotor;
