import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { BaseLayout } from "@/layouts/BaseLayout"
import { WorkoutBottomControls } from "./components/WorkoutBottomControls"
import { WorkoutDayView } from "./components/WorkoutDayView"
import { WorkoutHeader } from "./components/WorkoutHeader"

export const WorkoutScreen: React.FC = () => {
  const { openedWorkout, openedWorkoutLoading } = useOpenedWorkout()
  console.log({ openedWorkoutLoading })
  return (
    <BaseLayout>
      <WorkoutHeader />

      <WorkoutDayView
        workout={openedWorkout}
        isLoading={openedWorkoutLoading}
      />

      <WorkoutBottomControls />
    </BaseLayout>
  )
}
