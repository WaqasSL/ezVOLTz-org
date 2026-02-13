import { updateUserToken } from 'redux/auth/authSlice';
import { instance } from 'utls/instances';

export const getRefreshToken = async ({ userInfo, dispatch }) => {
  const result = await instance.get(`/refresh-token/${userInfo?.refreshToken}`);
  dispatch(updateUserToken(result?.data));
  return { data: result?.data };
};
