import {
  useFocusEffect,
  getFocusedRouteNameFromRoute,
  useRoute,
} from "@react-navigation/native";

import { tabBarRef } from "../navigation/AppTabs";
import { tabHiddenRoutes } from "../constants/miscellaneous";

const useTabBarVisibility = () => {
  const route = useRoute();

  useFocusEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (tabHiddenRoutes.includes(routeName)) {
      tabBarRef.current.setVisible(false);
    } else {
      tabBarRef.current.setVisible(true);
    }
  });
};

export default useTabBarVisibility;
