import { CHART_VIEW_KEY } from "@/constants/chartViews"
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
  measureRest: boolean
  setMeasureRest: (measureRest: boolean) => void
  previewNextSet: boolean
  setPreviewNextSet: (previewNextSet: boolean) => void
  colorSchemePreference: string
  setColorSchemePreference: (preference: string) => void
  highlightedSet: number | null
  setHighlightedSet: (id: number) => void
  chartHeight: number
  setChartHeight: (id: number) => void
  chartWidth: number
  setChartWidth: (id: number) => void
  chartView: CHART_VIEW_KEY
  setChartView: (view: CHART_VIEW_KEY) => void
}

export const SettingContext = createContext<SettingContextType | null>(null)

export interface SettingProviderProps {}

export const SettingProvider: FC<PropsWithChildren<SettingProviderProps>> = ({ children }) => {
  const [showCommentsCard, setShowCommentsCard] = useState(false)
  const [showSetCompletion, setShowSetCompletion] = useState(false)
  const [showWorkoutTimer, setShowWorkoutTimer] = useState(false)
  const [scientificMuscleNames, setScientificMuscleNames] = useState(false)
  const [measureRest, setMeasureRest] = useState(false)
  const [previewNextSet, setPreviewNextSet] = useState(false)
  const [colorSchemePreference, setColorSchemePreference] = useState("light")

  const [feedbackUser, setFeedbackUser] = useState("")
  const [exerciseSelectLastTab, setExerciseSelectLastTab] = useState("All Exercises")
  const [edittedExercise, setEdittedExercise] = useState<ExerciseModel | null>(null)
  const [highlightedSet, setHighlightedSet] = useState<number | null>(null)
  const [chartHeight, setChartHeight] = useState(0)
  const [chartWidth, setChartWidth] = useState(0)
  const [chartView, setChartView] = useState<CHART_VIEW_KEY>("30D")

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
    measureRest,
    setMeasureRest,
    previewNextSet,
    setPreviewNextSet,
    colorSchemePreference,
    setColorSchemePreference,
    highlightedSet,
    setHighlightedSet,
    chartHeight,
    setChartHeight,
    chartWidth,
    setChartWidth,
    chartView,
    setChartView,
  }

  return <SettingContext.Provider value={value}>{children}</SettingContext.Provider>
}

export const useSetting = () => {
  const context = useContext(SettingContext)
  if (!context) throw new Error("useSetting must be used within a SettingProvider")
  return context
}
