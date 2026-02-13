import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from './slices/auth/slice';
import manufacturesReducer from './slices/manufactures/slice';
import tripReducer from './slices/trip/slice';
import recentSearchesReducer from './slices/recentSearches/slice';
import filterReducer from './slices/filter/slice';
import byBoundReducer from './slices/byBound/slice';
import notificationsReducer from './slices/notifications/slice';
import adsReducer from './slices/ads/slice';
import saasChargeReducer from './slices/saasCharge/slice';

const createRootReducer = () => {
  return combineReducers({
    auth: authReducer,
    manufactures: manufacturesReducer,
    trip: tripReducer,
    recentSearches: recentSearchesReducer,
    filter: filterReducer,
    byBound: byBoundReducer,
    notifications: notificationsReducer,
    ads: adsReducer,
    saasCharge: saasChargeReducer,
  });
};

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const storeOptions = {
  reducer: persistReducer(persistConfig, createRootReducer()),
};

// const createDebugger = require("redux-flipper").default;
// storeOptions.middleware = (getDefaultMiddleware) =>
//   getDefaultMiddleware({
//     serializableCheck: false,
//     immutableCheck: false,
//     threshold: 50,
//   }).concat(createDebugger());

export const store = configureStore(storeOptions);
export const persistor = persistStore(store);
