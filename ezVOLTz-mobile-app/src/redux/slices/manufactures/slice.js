import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  manufactures: [],
};

export const manufacturesSlice = createSlice({
  name: "manufactures",
  initialState,
  reducers: {
    setManufactures: (state, { payload }) => {
      state.manufactures = payload;
    },
  },
});

export const { setManufactures } = manufacturesSlice.actions;

export default manufacturesSlice.reducer;
