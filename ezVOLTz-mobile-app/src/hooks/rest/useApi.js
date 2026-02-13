import useAxiosInterceptor from "./useAxiosInterceptor";

const useApiHook = () => {
  const { restInstance, restApiLoading } = useAxiosInterceptor();

  const handleRestApi = async ({ method, url, data, headers }) =>
    await restInstance({
      method,
      url,
      data,
      headers,
    });

  return { handleRestApi, restApiLoading };
};

export default useApiHook;
