import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSidebar: false,
  isPlanModal: false,
  isPlanTripModal: false,
  isNoTripModal: false,
  isNoVehicleModal: false,
  isPlanApiCall: false,
  isVehicleApiCall: false,
  vehicleManufactures: [],
  reviews: [],
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    handleNoTripModal: (state, { payload }) => {
      state.isNoTripModal = payload;
    },
    handleNoVehicleModal: (state, { payload }) => {
      state.isNoVehicleModal = payload;
    },
    handlePlanTripStepsModal: (state, { payload }) => {
      state.isPlanTripModal = payload;
    },
    handlPlanTripModal: (state, { payload }) => {
      state.isPlanModal = payload;
    },
    handlSidebar: (state, { payload }) => {
      state.isSidebar = payload;
    },
    toogleVehicleManufactures: (state, { payload }) => {
      state.vehicleManufactures = payload;
    },
    toggleIsPlanApiCall: (state, { payload }) => {
      state.isPlanApiCall = payload;
    },
    toggleIsVehicleApiCall: (state, { payload }) => {
      state.isVehicleApiCall = payload;
    },
    handleReviews: (state, { payload }) => {
      state.reviews = payload;
    },
  },
});

export const {
  handlePlanTripStepsModal,
  handlPlanTripModal,
  handlSidebar,
  toogleVehicleManufactures,
  toggleIsPlanApiCall,
  toggleIsVehicleApiCall,
  handleReviews,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
