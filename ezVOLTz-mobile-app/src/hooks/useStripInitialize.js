import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useStripe } from "@stripe/stripe-react-native";

import useApiHook from "./rest/useApi";

const useStripeInitialize = () => {
  const { auth } = useSelector((state) => state);
  const { initPaymentSheet } = useStripe();
  const { handleRestApi, restApiLoading } = useApiHook();

  const [paymentIntent, setPaymentIntent] = useState({});

  const fetchPaymentSheetParams = async () => {
    const response = await handleRestApi({
      method: `get`,
      url: `account/create/${auth.user._id}`,
    });

    const { setupIntent, ephemeralKey, customer } = response.data;

    setPaymentIntent({ setupIntent, ephemeralKey, customer });
    return {
      setupIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { setupIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      setupIntentClientSecret: setupIntent,
      applePay: {
        merchantCountryCode: "US",
        paymentSummaryItems: [
          {
            paymentType: "Immediate",
            amount: "0",
            label: "Some Label",
            isPending: true,
          },
        ],
      },
      style: "automatic",
      googlePay: {
        merchantCountryCode: "US",
        testEnv: false,
      },
      allowsDelayedPaymentMethods: true,
    });
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return {
    stripeInitializeLoading: restApiLoading,
    initializePaymentSheet,
    paymentIntent,
  };
};

export default useStripeInitialize;
