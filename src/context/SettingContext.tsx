import { ExerciseModel } from "@/db/models/ExerciseModel"
import { createContext, FC, PropsWithChildren, useContext, useState } from "react"

export type SettingContextType = {
  showCommentsCard: boolean
  setShowCommentsCard: (show: boolean) => void
  showSetCompletion: boolean
  setShowSetCompletion: (show: boolean) => void
  showWorkoutTimer: boolean
  setShowWorkoutTimer: (show: boolean) => void
  exerciseSelectLastTab: string
  setExerciseSelectLastTab: (tab: string) => void
  feedbackUser: string
  setFeedbackUser: (user: string) => void
  scientificMuscleNames: boolean
  setScientificMuscleNames: (scientificMuscleNames: boolean) => void
  edittedExercise: ExerciseModel | null
  setEdittedExercise: (exercise: ExerciseModel | null) => void
}

export const SettingContext = createContext<SettingContextType | null>(null)

export interface SettingProviderProps {}

export const SettingProvider: FC<PropsWithChildren<SettingProviderProps>> = ({ children }) => {
  const [showCommentsCard, setShowCommentsCard] = useState<boolean>(false)
  const [showSetCompletion, setShowSetCompletion] = useState<boolean>(false)
  const [showWorkoutTimer, setShowWorkoutTimer] = useState<boolean>(false)
  const [scientificMuscleNames, setScientificMuscleNames] = useState<boolean>(false)

  const [feedbackUser, setFeedbackUser] = useState<string>("")
  const [exerciseSelectLastTab, setExerciseSelectLastTab] = useState<string>("All Exercises")
  const [edittedExercise, setEdittedExercise] = useState<ExerciseModel | null>(null)

  const value = {
    showCommentsCard,
    setShowCommentsCard,
    showSetCompletion,
    setShowSetCompletion,
    showWorkoutTimer,
    setShowWorkoutTimer,
    exerciseSelectLastTab,
    setExerciseSelectLastTab,
    feedbackUser,
    setFeedbackUser,
    scientificMuscleNames,
    setScientificMuscleNames,
    edittedExercise,
    setEdittedExercise,
  }

  return <SettingContext.Provider value={value}>{children}</SettingContext.Provider>
}

export const useSetting = () => {
  const context = useContext(SettingContext)
  if (!context) throw new Error("useSetting must be used within a SettingProvider")
  return context
}
