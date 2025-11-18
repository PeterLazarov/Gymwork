import { Timer, translate, useTimer } from "@/utils"
import { Duration } from "luxon"
import { ReactNode, useContext, createContext } from "react"

type TimerContextType = Partial<Omit<Timer, "resume">> & {
  start?: (duration?: Duration) => void
}

const TimerContext = createContext<TimerContextType>({})

export const useTimerContext = () => useContext(TimerContext)

type Props = {
  children: ReactNode
}
export const TimerContextProvider: React.FC<Props> = ({ children }) => {
  const timer = useTimer()

  function start(duration?: Duration) {
    if (!timer) return

    timer.setTimeElapsed(duration ?? Duration.fromMillis(0))

    timer.resume()
  }

  return <TimerContext.Provider value={{ ...timer, start }}>{children}</TimerContext.Provider>
}
