import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: true,
  userCurrentLocation: null,
  userLocation: null,
  userVehicles: [],
  userInfo: {
    user: {
      name: 'Guest User',
      isActive: false,
      role: 'guest',
    },
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleLogin: (state, { payload }) => {
      state.isLogin = payload?.isLogin;
      state.userInfo = payload?.userInfo;
    },
    updateUserToken: (state, { payload }) => {
      state.userInfo.accessToken = payload?.accessToken;
      state.userInfo.refreshTokenn = payload?.refreshTokenn;
    },
    updateUser: (state, { payload }) => {
      state.userInfo.user = payload;
    },
    updateUserLocation: (state, { payload }) => {
      state.userCurrentLocation = payload;
    },
    updateLocation: (state, { payload }) => {
      state.userLocation = payload;
    },
    handleUserVehicles: (state, { payload }) => {
      state.userVehicles = payload;
    },
  },
});

export const {
  toggleLogin,
  updateUser,
  updateUserLocation,
  updateLocation,
  handleUserVehicles,
  updateUserToken,
} = authSlice.actions;

export default authSlice.reducer;
