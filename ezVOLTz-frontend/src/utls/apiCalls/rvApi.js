import { toast } from 'react-toastify';
import { instanceRV } from 'utls/instances';

export const getRVStations = async (params) => {
  try {
    const result = await instanceRV.get(`/mobile/parks`, { params });
    if (result.status === 200) {
      result?.data?.parks?.length <= 0 && toast.info('No RVs found!');
      return {
        isSuccess: true,
        data: result?.data,
      };
    }
  } catch (error) {
    toast.error(error?.response?.data?.error || error?.message);
    return {
      isError: true,
      data: error,
    };
  }
};
