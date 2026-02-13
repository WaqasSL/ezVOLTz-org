import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notificationsList: [],
  count: 0,
  isNotificationDot: false,
  notReadNotificationsCount: 0,
  notificationId: '',
  notification: {}
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotificationsFields: (state, { payload }) => {
      return { ...state, ...payload };
    },
    setNotification: (state, { payload }) => {
      state.notification = payload;
    },
    setIsNotificationDot: (state, { payload }) => {
      state.isNotificationDot = payload;
    },
    setNotificationId: (state, { payload }) => {
      state.notificationId = payload;
    },
  },
});

export const isNotificationDot = (state) =>
  state.notifications.isNotificationDot;

export const { setNotificationsFields, setIsNotificationDot, setNotificationId, setNotification } = notificationsSlice.actions;

export default notificationsSlice.reducer;










