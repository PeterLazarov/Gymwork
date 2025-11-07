import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { Appearance, ColorSchemeName } from "react-native"

import { CHART_VIEW_KEY } from "@/constants/chartViews"
import { ExerciseModel } from "@/db/models/ExerciseModel"
import { useSettingsQuery } from "@/db/queries/useSettingsQuery"
import { useUpdateSettingsQuery } from "@/db/queries/useUpdateSettingsQuery"
import { InsertSettings } from "@/db/schema"

let deviceColorScheme = Appearance.getColorScheme()
Appearance.addChangeListener(({ colorScheme }) => {
  deviceColorScheme = colorScheme
})

export type SettingContextType = {
  showCommentsCard: boolean
  setShowCommentsCard: (show: boolean) => void
  manualSetCompletion: boolean
  setManualSetCompletion: (show: boolean) => void
  showWorkoutTimer: boolean
  setShowWorkoutTimer: (show: boolean) => void
  exerciseSelectLastTab: string
  setExerciseSelectLastTab: (tab: string) => void
  feedbackUser: string
  setFeedbackUser: (user: string) => void
  scientificMuscleNames: boolean
  setScientificMuscleNames: (scientificMuscleNames: boolean) => void
  measureRest: boolean
  setMeasureRest: (measureRest: boolean) => void
  previewNextSet: boolean
  setPreviewNextSet: (previewNextSet: boolean) => void
  colorSchemePreference: ColorSchemeName
  setColorSchemePreference: (preference: ColorSchemeName) => void
  visitedWelcomeScreen: boolean
  setVisitedWelcomeScreen: (show: boolean) => void
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
  const { settings, isLoading } = useSettingsQuery({
    theme: deviceColorScheme ?? null,
  })
  const updateSettings = useUpdateSettingsQuery()
  const settingsId = settings?.id ?? null

  const [showCommentsCard, setShowCommentsCardState] = useState(false)
  const [manualSetCompletion, setManualSetCompletionState] = useState(false)
  const [showWorkoutTimer, setShowWorkoutTimerState] = useState(false)
  const [scientificMuscleNames, setScientificMuscleNamesState] = useState(false)
  const [measureRest, setMeasureRestState] = useState(false)
  const [previewNextSet, setPreviewNextSetState] = useState(false)
  const [visitedWelcomeScreen, setVisitedWelcomeScreen] = useState(false)
  const [colorSchemePreference, setColorSchemePreferenceState] = useState<ColorSchemeName>(
    deviceColorScheme ?? "light",
  )
  const [feedbackUser, setFeedbackUserState] = useState("")

  const [exerciseSelectLastTab, setExerciseSelectLastTab] = useState("All Exercises")
  const [highlightedSet, setHighlightedSet] = useState<number | null>(null)
  const [chartHeight, setChartHeight] = useState(0)
  const [chartWidth, setChartWidth] = useState(0)
  const [chartView, setChartView] = useState<CHART_VIEW_KEY>("30D")

  const persistSettings = useCallback(
    async (updates: Partial<InsertSettings>) => {
      if (!settingsId) return
      try {
        await updateSettings(settingsId, updates)
      } catch (error) {
        console.error("Failed to persist settings", error)
      }
    },
    [settingsId, updateSettings],
  )

  useEffect(() => {
    if (!settings) return

    setShowCommentsCardState(!!settings.show_comments_card)
    setManualSetCompletionState(!!settings.manual_set_completion)
    setShowWorkoutTimerState(!!settings.show_workout_timer)
    setScientificMuscleNamesState(!!settings.scientific_muscle_names_enabled)
    setMeasureRestState(!!settings.measure_rest)
    setPreviewNextSetState(!!settings.preview_next_set)
    setVisitedWelcomeScreen(!!settings.visited_welcome_screen)
    setFeedbackUserState(settings.feedback_user ?? "")

    const persistedScheme = (settings.theme ?? undefined) as ColorSchemeName
    setColorSchemePreferenceState(persistedScheme)
    const appearanceScheme = persistedScheme ?? deviceColorScheme ?? null
    Appearance.setColorScheme?.(appearanceScheme)
  }, [settings])

  const handleSetShowCommentsCard = useCallback(
    (show: boolean) => {
      setShowCommentsCardState(show)
      persistSettings({ show_comments_card: show })
    },
    [persistSettings],
  )

  const handleSetManualSetCompletion = useCallback(
    (value: boolean) => {
      setManualSetCompletionState(value)
      persistSettings({ manual_set_completion: value })
    },
    [persistSettings],
  )

  const handleSetShowWorkoutTimer = useCallback(
    (show: boolean) => {
      setShowWorkoutTimerState(show)
      persistSettings({ show_workout_timer: show })
    },
    [persistSettings],
  )

  const handleSetScientificMuscleNames = useCallback(
    (enabled: boolean) => {
      setScientificMuscleNamesState(enabled)
      persistSettings({ scientific_muscle_names_enabled: enabled })
    },
    [persistSettings],
  )

  const handleSetMeasureRest = useCallback(
    (enabled: boolean) => {
      setMeasureRestState(enabled)
      persistSettings({ measure_rest: enabled })
    },
    [persistSettings],
  )

  const handleSetPreviewNextSet = useCallback(
    (enabled: boolean) => {
      setPreviewNextSetState(enabled)
      persistSettings({ preview_next_set: enabled })
    },
    [persistSettings],
  )

  const handleSetColorSchemePreference = useCallback(
    (scheme: ColorSchemeName) => {
      setColorSchemePreferenceState(scheme)
      const appearanceScheme = scheme ?? deviceColorScheme ?? null
      Appearance.setColorScheme?.(appearanceScheme)
      persistSettings({ theme: scheme ?? null })
    },
    [persistSettings],
  )

  const handleSetVisitedWelcomeScreen = useCallback(
    (enabled: boolean) => {
      setVisitedWelcomeScreen(enabled)
      persistSettings({ visited_welcome_screen: enabled })
    },
    [persistSettings],
  )

  const handleSetFeedbackUser = useCallback(
    (user: string) => {
      setFeedbackUserState(user)
      persistSettings({ feedback_user: user })
    },
    [persistSettings],
  )

  if (isLoading || !settingsId) {
    return null
  }

  const value = {
    showCommentsCard,
    setShowCommentsCard: handleSetShowCommentsCard,
    manualSetCompletion,
    setManualSetCompletion: handleSetManualSetCompletion,
    showWorkoutTimer,
    setShowWorkoutTimer: handleSetShowWorkoutTimer,
    exerciseSelectLastTab,
    setExerciseSelectLastTab,
    feedbackUser,
    setFeedbackUser: handleSetFeedbackUser,
    scientificMuscleNames,
    setScientificMuscleNames: handleSetScientificMuscleNames,
    measureRest,
    setMeasureRest: handleSetMeasureRest,
    previewNextSet,
    setPreviewNextSet: handleSetPreviewNextSet,
    colorSchemePreference,
    setColorSchemePreference: handleSetColorSchemePreference,
    visitedWelcomeScreen,
    setVisitedWelcomeScreen: handleSetVisitedWelcomeScreen,
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
