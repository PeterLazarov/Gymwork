import { createContext, FC, PropsWithChildren, useContext, useState } from "react"

export type SettingContextType = {
  showCommentsCard: boolean
  setShowCommentsCard: (show: boolean) => void
  showSetCompletion: boolean
  setShowSetCompletion: (show: boolean) => void
  showWorkoutTimer: boolean
  setShowWorkoutTimer: (show: boolean) => void
}

export const SettingContext = createContext<SettingContextType | null>(null)

export interface SettingProviderProps {}

export const SettingProvider: FC<PropsWithChildren<SettingProviderProps>> = ({ children }) => {
  const [showCommentsCard, setShowCommentsCard] = useState<boolean>(false)
  const [showSetCompletion, setShowSetCompletion] = useState<boolean>(false)
  const [showWorkoutTimer, setShowWorkoutTimer] = useState<boolean>(false)

  const value = {
    showCommentsCard,
    setShowCommentsCard,
    showSetCompletion,
    setShowSetCompletion,
    showWorkoutTimer,
    setShowWorkoutTimer,
  }

  return <SettingContext.Provider value={value}>{children}</SettingContext.Provider>
}

export const useSetting = () => {
  const context = useContext(SettingContext)
  if (!context) throw new Error("useSetting must be used within a SettingProvider")
  return context
}
