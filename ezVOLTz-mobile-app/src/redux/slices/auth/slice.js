import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  accessToken: null,
  refreshToken: null,
  displayOnboarding: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthFields: (state, { payload }) => {
      return { ...state, ...payload };
    },
    clearAuth: () => {
      return initialState;
    },
  },
});

export const { setAuthFields, clearAuth } = authSlice.actions;

export default authSlice.reducer;
