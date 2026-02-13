import { useEffect, useState } from "react";

import { nrelInstance } from "../../utils/instance";
import { showSnackDanger } from "../../utils/functions";

const useNrelInterceptor = () => {
  const [nrelApiLoading, setNrelApiLoading] = useState(false);

  useEffect(() => {
    const requestIntercept = nrelInstance.interceptors.request.use(
      (config) => {
        setNrelApiLoading(true);
        return config;
      },
      (error) => {
        showSnackDanger(error?.response?.data?.error || error.message);
        return Promise.reject(error);
      }
    );

    const responseIntercept = nrelInstance.interceptors.response.use(
      function (response) {
        setNrelApiLoading(false);
        return response;
      },
      async function (error) {
        setNrelApiLoading(false);
        if (error?.code !== "ERR_NETWORK")
          showSnackDanger(error?.response?.data?.error || error.message);
        return Promise.reject(error);
      }
    );

    return () => {
      nrelInstance.interceptors.request.eject(requestIntercept);
      nrelInstance.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return { nrelInstance, nrelApiLoading };
};

export default useNrelInterceptor;
