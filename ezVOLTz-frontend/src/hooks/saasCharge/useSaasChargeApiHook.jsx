import useSaasChargeAxiosInterceotor from './useSaasChargeAxiosInterceotor';

const useSaasChargeApiHook = () => {
  const { instanceSassCharge, isSassLoading } = useSaasChargeAxiosInterceotor();

  const handleSassApiCall = async ({ method, url, data, headers }) =>
    await instanceSassCharge({
      method,
      url,
      data,
      headers,
    });

  return { handleSassApiCall, isSassLoading };
};

export default useSaasChargeApiHook;
