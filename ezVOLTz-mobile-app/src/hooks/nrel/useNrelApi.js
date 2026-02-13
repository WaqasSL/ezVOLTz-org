import useNrelInterceptor from "./useNrelInterceptor";

const useNrelApiHook = () => {
  const { nrelInstance, nrelApiLoading } = useNrelInterceptor();

  const handleNrelApi = async ({ method, url, data, headers, params }) =>
    await nrelInstance({
      method,
      url,
      data,
      headers,
      params,
    });

  return { handleNrelApi, nrelApiLoading };
};

export default useNrelApiHook;
