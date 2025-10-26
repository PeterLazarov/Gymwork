import { CalendarScreenParams } from "@/components/CalendarScreen"
import { ExerciseDetailsScreenParams } from "@/components/ExerciseDetailsScreen"
import { ExerciseEditScreenParams } from "@/components/ExerciseEditScreen"
import { ExerciseSelectScreenParams } from "@/components/ExerciseSelectScreen"
import { TemplateSaveScreenParams } from "@/components/TemplateSaveScreen"
import { UserFeedbackScreenParams } from "@/components/UserFeedbackScreen"
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
  TemplateSelect: undefined
  WorkoutFeedback: undefined
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
