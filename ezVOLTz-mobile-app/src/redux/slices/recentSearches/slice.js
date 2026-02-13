import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: [],
  destination: [],
  stops: [],
  home: [],
};

export const recentSearchesSlice = createSlice({
  name: "recentSearches",
  initialState,
  reducers: {
    setRecentSearchesFields: (state, { payload }) => {
      return { ...state, ...payload };
    },
  },
});

export const { setRecentSearchesFields } = recentSearchesSlice.actions;

export default recentSearchesSlice.reducer;
