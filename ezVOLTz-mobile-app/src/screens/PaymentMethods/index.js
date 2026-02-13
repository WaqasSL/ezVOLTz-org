import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { useStripe } from "@stripe/stripe-react-native";
import NetworkLogger from "react-native-network-logger";
import { useSelector } from "react-redux";

import PrimaryHeader from "../../components/Headers/PrimaryHeader";
import PaymentMethodCard from "../../components/Cards/PaymentMethodCard";
import SwipeItem from "./components/SwipeItem";
import VerticalSpace from "../../components/VerticalSpace";
import SolidButton from "../../components/Buttons/SolidButton";
import Loader from "../../components/Loader";
import EmptyList from "../../components/EmptyList";

import { BLACK, JASPER_CANE, WHITE, WHITE_SMOKE } from "../../constants/colors";
import { widthRem } from "../../constants/dimensions";
import useStripeInitialize from "../../hooks/useStripInitialize";
import { showSnackDanger, showSnackSuccess } from "../../utils/functions";
import useApiHook from "../../hooks/rest/useApi";
import { isEmpty } from "lodash";

const PaymentMethods = () => {
  const navigation = useNavigation();
  const { presentPaymentSheet } = useStripe();
  const { stripeInitializeLoading, initializePaymentSheet } =
    useStripeInitialize();
  const { handleRestApi, restApiLoading } = useApiHook();
  const { auth } = useSelector((state) => state);

  const USER_ID = auth.user._id;

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    initializePaymentSheet();
    getAllPaymentMethods();

    if (error) {
      showSnackDanger(`${error.message}`);
    } else {
      showSnackSuccess(`Payment method has been added`);
    }
  };

  const getAllPaymentMethods = async () => {
    const response = await handleRestApi({
      method: `get`,
      url: `account/payment-methods/${USER_ID}`,
    });

    if (response.status === 200) {
      setPaymentMethods(response.data.paymentMethods.data);
    }

    setIsDataLoaded(true);
  };

  const deletePaymentMethod = async (id) => {
    const response = await handleRestApi({
      method: `delete`,
      url: `account/customer/payment/${USER_ID}/${id}`,
    });

    if (response.status === 200) {
      showSnackSuccess(`Your card has been deleted`);
      getAllPaymentMethods();
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAllPaymentMethods();
    }, [])
  );

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      {stripeInitializeLoading && restApiLoading && <Loader />}

      <PrimaryHeader
        label={`Payment Methods`}
        color={BLACK}
        displayBackButton={true}
        onBackButtonPress={goBack}
      />

      <View style={styles.listContainer}>
        {!isDataLoaded || isEmpty(paymentMethods) ? (
          <>
            {!isDataLoaded ? null : (
              <EmptyList
                label={`No Payment Method Found`}
                buttonLable={`Add Payment Method`}
                onPress={openPaymentSheet}
                displayButton
              />
            )}
          </>
        ) : (
          <SwipeListView
            data={paymentMethods}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <PaymentMethodCard data={item} />}
            renderHiddenItem={({ item }) => (
              <SwipeItem onDeletePress={() => deletePaymentMethod(item.id)} />
            )}
            rightOpenValue={-widthRem * 24}
            disableRightSwipe={true}
            keyExtractor={(item) => item.id}
            ListFooterComponent={
              <>
                <VerticalSpace h={1} />

                <SolidButton
                  label={`Add Payment Method`}
                  size={`lg`}
                  customButtonStyle={styles.customAddVehicleButton}
                  customTextStyle={styles.customAddVehicleText}
                  onPress={openPaymentSheet}
                />

                <VerticalSpace h={2} />
              </>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default PaymentMethods;

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  listContainer: {
    flex: 1,
    backgroundColor: WHITE_SMOKE,
  },
  customAddVehicleButton: {
    backgroundColor: JASPER_CANE,
    alignSelf: "center",
  },
  customAddVehicleText: { color: BLACK },
});
