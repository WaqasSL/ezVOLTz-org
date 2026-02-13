import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const byBoundSlice = createSlice({
  name: "byBound",
  initialState,
  reducers: {
    setByBound: (state, { payload }) => {
      return { ...state, ...payload };
    },
    clearByBound: () => initialState,
  },
});

export const { setByBound, clearByBound } = byBoundSlice.actions;

export default byBoundSlice.reducer;
