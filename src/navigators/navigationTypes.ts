import { ComponentProps } from "react"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import {
  CompositeScreenProps,
  NavigationContainer,
  NavigatorScreenParams,
  RouteProp,
  useRoute,
} from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { CalendarScreenParams } from "@/screens/CalendarScreen"
import { ExerciseSelectScreenParams } from "@/screens/ExerciseSelect"

// Demo Tab Navigator types
export type DemoTabParamList = {
  DemoCommunity: undefined
  DemoShowroom: { queryIndex?: string; itemIndex?: string }
  DemoDebug: undefined
  DemoPodcastList: undefined
}

// App Stack Navigator types
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined
  Demo: NavigatorScreenParams<DemoTabParamList>
  Workout: undefined
  Calendar: CalendarScreenParams
  ExerciseSelect: ExerciseSelectScreenParams
  // 🔥 Your screens go here
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

export type DemoTabScreenProps<T extends keyof DemoTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<DemoTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

export interface NavigationProps
  extends Partial<ComponentProps<typeof NavigationContainer<AppStackParamList>>> {}


  export const useRouteParams = <T extends keyof AppStackParamList>(
    screen: T
  ): AppStackParamList[T] => {
    const route = useRoute<RouteProp<AppStackParamList, T>>()
    return (route.params ?? {}) as AppStackParamList[T]
  }