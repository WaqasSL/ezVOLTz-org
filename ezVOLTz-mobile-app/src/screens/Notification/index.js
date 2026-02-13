import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SkypeIndicator } from "react-native-indicators";

import PrimaryHeader from "../../components/Headers/PrimaryHeader";
import TextButton from "../../components/Buttons/TextButton";
import NotificationCard from "../../components/Cards/NotificationCard";

import { BLACK, THEME, WHITE } from "../../constants/colors";
import { heightRem, screenRem } from "../../constants/dimensions";
import { setNotificationsFields } from "../../redux/slices/notifications/slice";
import useApiHook from "../../hooks/rest/useApi";
import { Button } from "react-native-paper";
import { set } from "lodash";

const Notification = () => {
  const navigation = useNavigation();
  const { notifications } = useSelector((state) => state);
  const dispatch = useDispatch();
  const isFocued = useIsFocused();
  const { handleRestApi, restApiLoading } = useApiHook();

  const [page, setPage] = useState(10);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await loadMoreNotifications(10);
    } catch (error) {
      console.error("Error refreshing notifications:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isFocued) {
      loadMoreNotifications(10);
    }
  }, [isFocued]);

  const handleMarkAllAsRead = async () => {
    const { notificationsList } = notifications;

    if (!notificationsList || !notificationsList.length) {
      return;
    }

    const updatedNotificationsList = notificationsList.map((notification) => ({
      ...notification,
      read: true,
    }));

    dispatch(
      setNotificationsFields({
        notificationsList: updatedNotificationsList,
        notReadNotificationsCount: 0,
      }),
    );

    await handleRestApi({
      method: "put",
      url: "notifications/mark-all-as-read",
    });
  };

  const handleMarkAsRead = async (data) => {
    const updatedNotificationsList = notifications.notificationsList.map(
      (notification) =>
        data._id === notification._id
          ? { ...notification, read: true }
          : notification,
    );

    dispatch(
      setNotificationsFields({
        notificationsList: updatedNotificationsList,
        notReadNotificationsCount: notifications?.notReadNotificationsCount - 1,
      }),
    );

    const route = data.url.split("&/")[1];

    goFromNotification(route);

    await handleRestApi({
      method: "put",
      url: `notifications/mark-one-as-read/${data._id}`,
    });
  };

  const loadMoreNotifications = async (page) => {
    const response = await handleRestApi({
      method: "get",
      url: `notifications/all?page=${1}&limit=${page}`,
    });

    if (response?.data?.notifications) {
      dispatch(
        setNotificationsFields({
          notificationsList: response?.data?.notifications,
        }),
      );
    }
  };

  const goFromNotification = useCallback(
    (route) => {
      navigation.navigate(route);
    },
    [navigation],
  );

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleLoadMore = () => {
    if (
      notifications.notificationsList?.length < notifications?.count &&
      !restApiLoading
    ) {
      setPage(page + 5);
      loadMoreNotifications(page + 5);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <PrimaryHeader
        label={`Notification`}
        color={BLACK}
        displayBackButton={true}
        onBackButtonPress={goBack}
        isNotification={true}
      >
        <TextButton
          label={`Mark All As Read`}
          customTextStyle={{
            color: THEME,
            fontSize: screenRem,
            opacity: notifications.notReadNotificationsCount > 0 ? 1 : 0.3,
          }}
          onPress={handleMarkAllAsRead}
          disable={notifications.notReadNotificationsCount > 0 ? false : true}
        />
      </PrimaryHeader>

      <FlatList
        data={notifications.notificationsList}
        renderItem={({ item }) => (
          <NotificationCard
            data={item}
            handleNotificationOnPress={() => handleMarkAsRead(item)}
          />
        )}
        keyExtractor={(item, index) => item._id.toString()}
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleLoadMore}
        ListFooterComponent={() => {
          return restApiLoading && page > 1 ? (
            <ActivityIndicator size={32} color={THEME} />
          ) : null;
        }}
        ListFooterComponentStyle={{
          marginBottom: heightRem * 10,
          marginTop: heightRem * 2,
        }}
        refreshing={restApiLoading}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[THEME]}
            tintColor={THEME}
          />
        }
      />
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  safeAreaViewContainer: { flex: 1, backgroundColor: WHITE },
  childContainer: { flex: 1 },
  contentContainerStyle: { paddingTop: heightRem * 2 },
});
