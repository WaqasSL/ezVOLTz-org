import useNrelAxiosInterceotor from './useNrelAxiosInterceotor';

const useNrelApiHook = () => {
  const { instanceNREL, isNrelLoading } = useNrelAxiosInterceotor();

  const handleNrelApiCall = async ({ method, url, data, headers, params }) =>
    await instanceNREL({
      method,
      url,
      data,
      headers,
      params,
    });

  return { handleNrelApiCall, isNrelLoading };
};

export default useNrelApiHook;
