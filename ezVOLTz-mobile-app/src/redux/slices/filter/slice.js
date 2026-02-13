import { createSlice } from "@reduxjs/toolkit";

import {
  networkTypeData,
  connectorTypeData,
} from "../../../constants/miscellaneous";

const initialState = {
  network: networkTypeData,
  showPrivateStations: false,
  showAvailableStations: true,
  connector: connectorTypeData,
  owner: { id: 1, label: "All", value: "all" }, //availble in miscellaneous.js
  fuel: { id: 1, label: "All", value: "all" }, //availble in miscellaneous.js
  incAc1: false,
  incAc2: true,
  incDc: true,
  incLegacy: true,
  radius: { id: 1, label: "25 Miles", value: "25" }, //availble in miscellaneous.js
  location: {},
  applyFilter: false,
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilterFields: (state, { payload }) => {
      return { ...state, ...payload };
    },
    clearFilter: () => {
      return initialState;
    },
  },
});

export const { setFilterFields, clearFilter } = filterSlice.actions;

export default filterSlice.reducer;
