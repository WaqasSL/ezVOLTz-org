import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

const useInternetStatus = () => {
  const [isInternetConnected, setIsInternetConnected] = useState({
    isConnected: true,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsInternetConnected({
        isConnected: state.isConnected,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { isInternetConnected };
};

export default useInternetStatus;
