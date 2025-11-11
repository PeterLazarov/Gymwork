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

  const defaultSettings: InsertSettings = {
    show_comments_card: false,
    manual_set_completion: false,
    show_workout_timer: false,
    scientific_muscle_names_enabled: false,
    measure_rest: false,
    preview_next_set: false,
    visited_welcome_screen: false,
    feedback_user: "",
    theme: deviceColorScheme ?? "light",
  }

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

    const appearanceScheme = settings.theme ?? deviceColorScheme ?? null
    Appearance.setColorScheme?.(appearanceScheme)
  }, [settings])

  if (isLoading || !settingsId) {
    return null
  }

  const value = {
    showCommentsCard: settings?.show_comments_card || defaultSettings.show_comments_card!,
    setShowCommentsCard: (show: boolean) => {
      persistSettings({ show_comments_card: show })
    },
    manualSetCompletion: settings?.manual_set_completion || defaultSettings.manual_set_completion!,
    setManualSetCompletion: (value: boolean) => {
      persistSettings({ manual_set_completion: value })
    },
    showWorkoutTimer: settings?.show_workout_timer || defaultSettings.show_workout_timer!,
    setShowWorkoutTimer: (show: boolean) => {
      persistSettings({ show_workout_timer: show })
    },
    feedbackUser: settings?.feedback_user || defaultSettings.feedback_user!,
    setFeedbackUser: (user: string) => {
      persistSettings({ feedback_user: user })
    },
    scientificMuscleNames:
      settings?.scientific_muscle_names_enabled || defaultSettings.scientific_muscle_names_enabled!,
    setScientificMuscleNames: (enabled: boolean) => {
      persistSettings({ scientific_muscle_names_enabled: enabled })
    },
    measureRest: settings?.measure_rest || defaultSettings.measure_rest!,
    setMeasureRest: (enabled: boolean) => {
      persistSettings({ measure_rest: enabled })
    },
    previewNextSet: settings?.preview_next_set || defaultSettings.preview_next_set!,
    setPreviewNextSet: (enabled: boolean) => {
      persistSettings({ preview_next_set: enabled })
    },
    colorSchemePreference: settings?.theme || defaultSettings.theme!,
    setColorSchemePreference: (scheme: ColorSchemeName) => {
      const appearanceScheme = scheme ?? deviceColorScheme ?? null
      Appearance.setColorScheme?.(appearanceScheme)
      persistSettings({ theme: scheme ?? null })
    },
    visitedWelcomeScreen:
      settings?.visited_welcome_screen || defaultSettings.visited_welcome_screen!,
    setVisitedWelcomeScreen: (enabled: boolean) => {
      persistSettings({ visited_welcome_screen: enabled })
    },
    exerciseSelectLastTab,
    setExerciseSelectLastTab,
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
