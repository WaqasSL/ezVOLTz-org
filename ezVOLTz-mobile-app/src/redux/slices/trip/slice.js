import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: {},
  destination: {},
  stops: [],
  vehicle: {},
  network: {},
  connector: {},
  vehicleCompatibility: false,
  avoidTolls: false,
  avoidHighways: false,
  availableChargers: false,
  directions: {},
  date: null,
  time: null,
};

export const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {
    setTripFields: (state, { payload }) => {
      return { ...state, ...payload };
    },
    clearTrip: () => {
      return initialState;
    },
  },
});

export const { setTripFields, clearTrip } = tripSlice.actions;

export default tripSlice.reducer;
