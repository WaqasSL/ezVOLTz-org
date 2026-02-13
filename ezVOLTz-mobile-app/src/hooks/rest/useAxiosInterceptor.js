// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import { restInstance } from "../../utils/instance";
// import { showSnackDanger } from "../../utils/functions";
// import { setAuthFields } from "../../redux/slices/auth/slice";

// let isRefreshing = false;
// let refreshSubscribers = [];

// const addSubscriber = (callback) => {
//   refreshSubscribers.push(callback);
// };

// const onRefreshed = (token) => {
//   refreshSubscribers.forEach((callback) => callback(token));
//   refreshSubscribers = [];
// };

// const useAxiosInterceptor = () => {
//   const { auth } = useSelector((state) => state);
//   const dispatch = useDispatch();
//   const [restApiLoading, setRestApiLoading] = useState(false);

//   useEffect(() => {
//     const requestIntercept = restInstance.interceptors.request.use(
//       (config) => {
//         setRestApiLoading(true);
//         config.headers["retryCall"] = 1;
//         if (!config.headers["Authorization"]) {
//           config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
//         }
//         return config;
//       },
//       (error) => {
//         setRestApiLoading(false);
//         showSnackDanger(error?.response?.data?.error || error.message);
//         return Promise.reject(error);
//       },
//     );

//     const responseIntercept = restInstance.interceptors.response.use(
//       (response) => {
//         setRestApiLoading(false);
//         return response;
//       },
//       async (error) => {
//         setRestApiLoading(false);

//         const prevRequest = error.config;
//         if (error?.response?.status === 403 && !prevRequest.sent) {
//           if (!isRefreshing) {
//             isRefreshing = true;

//             try {
//               const result = await restInstance.get(
//                 `refresh-token/${auth.refreshToken}`,
//               );
//               const { accessToken, refreshToken } = result.data;

//               dispatch(
//                 setAuthFields({
//                   accessToken,
//                   refreshToken,
//                 }),
//               );

//               onRefreshed(accessToken);
//               isRefreshing = false;
//             } catch (refreshError) {
//               isRefreshing = false;
//               refreshSubscribers = [];
//               showSnackDanger(
//                 refreshError?.response?.data?.error ||
//                   "Session expired. Please log in again.",
//               );
//               return Promise.reject(refreshError);
//             }
//           }

//           // Wait for the token to be refreshed
//           return new Promise((resolve) => {
//             addSubscriber((token) => {
//               prevRequest.headers["Authorization"] = `Bearer ${token}`;
//               resolve(restInstance(prevRequest));
//             });
//           });
//         }

//         if (+prevRequest.headers["retryCall"] === 1) {
//           showSnackDanger(error?.response?.data?.error || error.message);
//         }
//         prevRequest.headers["retryCall"] = 2;
//         return Promise.reject(error);
//       },
//     );

//     return () => {
//       setRestApiLoading(false);
//       restInstance.interceptors.request.eject(requestIntercept);
//       restInstance.interceptors.response.eject(responseIntercept);
//     };
//   }, [auth.accessToken, auth.refreshToken]);

//   return { restInstance, restApiLoading };
// };

// export default useAxiosInterceptor;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { restInstance } from "../../utils/instance";
import { showSnackDanger } from "../../utils/functions";
import { setAuthFields } from "../../redux/slices/auth/slice";

let isRefreshing = false;
let refreshSubscribers = [];

const addSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const useAxiosInterceptor = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [restApiLoading, setRestApiLoading] = useState(false);

  useEffect(() => {
    const requestIntercept = restInstance.interceptors.request.use(
      (config) => {
        setRestApiLoading(true);
        config.headers["retryCall"] = 1;
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => {
        setRestApiLoading(false);
        showSnackDanger(error?.response?.data?.error || error.message);
        return Promise.reject(error);
      },
    );

    const responseIntercept = restInstance.interceptors.response.use(
      (response) => {
        setRestApiLoading(false);
        return response;
      },
      async (error) => {
        setRestApiLoading(false);

        const prevRequest = error.config;

        if (
          error?.response?.status === 403 &&
          auth.refreshToken &&
          !prevRequest.sent
        ) {
          if (!isRefreshing) {
            isRefreshing = true;

            try {
              const result = await restInstance.get(
                `refresh-token/${auth.refreshToken}`,
              );
              const { accessToken, refreshToken } = result.data;

              dispatch(
                setAuthFields({
                  accessToken,
                  refreshToken,
                }),
              );

              onRefreshed(accessToken);
              isRefreshing = false;
            } catch (refreshError) {
              isRefreshing = false;
              refreshSubscribers = [];
              showSnackDanger(
                refreshError?.response?.data?.error ||
                  "Session expired. Please log in again.",
              );
              return Promise.reject(refreshError);
            }
          }

          return new Promise((resolve) => {
            addSubscriber((token) => {
              prevRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(restInstance(prevRequest));
            });
          });
        }

        if (+prevRequest.headers["retryCall"] === 1) {
          showSnackDanger(error?.response?.data?.error || error.message);
        }
        prevRequest.headers["retryCall"] = 2;
        return Promise.reject(error);
      },
    );

    return () => {
      setRestApiLoading(false);
      restInstance.interceptors.request.eject(requestIntercept);
      restInstance.interceptors.response.eject(responseIntercept);
    };
  }, [auth.accessToken, auth.refreshToken]);

  return { restInstance, restApiLoading };
};

export default useAxiosInterceptor;
