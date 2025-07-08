import { withLayoutContext } from "expo-router"
import {
  createNativeBottomTabNavigator,
  NativeBottomTabNavigationOptions,
  NativeBottomTabNavigationEventMap,
} from "@bottom-tabs/react-navigation"
import { ParamListBase, TabNavigationState } from "@react-navigation/native"

const BottomNativeTabNavigator = createNativeBottomTabNavigator().Navigator

export const NativeTabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof BottomNativeTabNavigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(BottomNativeTabNavigator)
