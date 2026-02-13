import useSaasInterceptor from "./useSaasInterceptor";

const useSaasApiHook = () => {
  const { saasInstance, saasApiLoading } = useSaasInterceptor();

  const handleSaasApi = async ({ method, url, data, headers }) =>
    await saasInstance({
      method,
      url,
      data,
      headers,
    });

  return { handleSaasApi, saasApiLoading };
};

export default useSaasApiHook;
