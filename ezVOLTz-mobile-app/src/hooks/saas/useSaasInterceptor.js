import { useEffect, useState } from "react";

import { showSnackDanger } from "../../utils/functions";
import { saasInstance } from "../../utils/instance";

const useSaasInterceptor = () => {
  const [saasApiLoading, setSaasApiLoading] = useState(false);
  useEffect(() => {
    const requestIntercept = saasInstance.interceptors.request.use(
      (config) => {
        setSaasApiLoading(true);
        return config;
      },
      (error) => {
        showSnackDanger(error?.response?.data?.error || error.message);
        return Promise.reject(error);
      }
    );

    const responseIntercept = saasInstance.interceptors.response.use(
      function (response) {
        setSaasApiLoading(false);
        return response;
      },
      async function (error) {
        setSaasApiLoading(false);
        showSnackDanger(error?.response?.data?.error || error.message);
        return Promise.reject(error);
      }
    );

    return () => {
      saasInstance.interceptors.request.eject(requestIntercept);
      saasInstance.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return { saasInstance, saasApiLoading };
};

export default useSaasInterceptor;
