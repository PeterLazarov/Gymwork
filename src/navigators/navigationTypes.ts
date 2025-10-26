import { CalendarScreenParams } from "@/screens/CalendarScreen"
import { ExerciseDetailsScreenParams } from "@/screens/ExerciseDetails"
import { ExerciseEditScreenParams } from "@/screens/ExerciseEdit"
import { ExerciseSelectScreenParams } from "@/screens/ExerciseSelect"
import { TemplateSaveScreenParams } from "@/screens/TemplateSave"
import { UserFeedbackScreenParams } from "@/screens/UserFeedback"
import { NavigationContainer, RouteProp, useRoute } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { ComponentProps } from "react"

export type AppStackParamList = {
  Welcome: undefined
  Login: undefined
  Workout: undefined
  Calendar: CalendarScreenParams
  ExerciseSelect: ExerciseSelectScreenParams
  ExerciseDetails: ExerciseDetailsScreenParams
  UserFeedback: UserFeedbackScreenParams
  TemplateSave: TemplateSaveScreenParams
  ExerciseEdit: ExerciseEditScreenParams
}

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

export interface NavigationProps
  extends Partial<ComponentProps<typeof NavigationContainer<AppStackParamList>>> {}

export const useRouteParams = <T extends keyof AppStackParamList>(
  screen: T,
): AppStackParamList[T] => {
  const route = useRoute<RouteProp<AppStackParamList, T>>()
  return (route.params ?? {}) as AppStackParamList[T]
}
