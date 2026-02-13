import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    ads: [],
    activeAd: {},
    activeAdIndex: 0,
    vehiclesAd: true,
    upcomingTripAd: true,
    pastTripAd: true
};

export const ads = createSlice({
    name: "ads",
    initialState,
    reducers: {
        setAds: (state, action) => {
            state.ads = action.payload;
        },
        setActiveAdIndex: (state, action) => {
            state.activeAdIndex = action.payload;
        },
        setActiveAd: (state, action) => {
            state.activeAd = action.payload;
        },
        setVehiclesAd: (state, action) => {
            state.vehiclesAd = action.payload;
        },
        setUpcomingTripAd: (state, action) => {
            state.upcomingTripAd = action.payload;
        },
        setPastTripAd: (state, action) => {
            state.pastTripAd = action.payload;
        },
        clearAds: () => {
            return initialState;
        },
    },
});

export const { setAds, setActiveAdIndex, setActiveAd, setVehiclesAd, setUpcomingTripAd, setPastTripAd, clearAds } =
    ads.actions;

export default ads.reducer;