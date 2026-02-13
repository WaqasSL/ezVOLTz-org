import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  connectorPk: null,
  preparingId: null,
  isWebHookCall: false,
};

export const saasChargeSlice = createSlice({
  name: "saasCharge",
  initialState,
  reducers: {
    setSaasChargeDetails: (state, { payload }) => {
      state.connectorPk = payload;
    },
    setPreparingId: (state, { payload }) => {
      state.preparingId = payload;
    },
    setIsWebHookCall: (state, { payload }) => {
      state.isWebHookCall = payload;
    },
    clearSaasChargeDetails: () => {
      return initialState;
    },
  },
});

export const { setSaasChargeDetails, setPreparingId, clearSaasChargeDetails, setIsWebHookCall } = saasChargeSlice.actions;

export default saasChargeSlice.reducer;
