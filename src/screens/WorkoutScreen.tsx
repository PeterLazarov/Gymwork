import { WorkoutBottomControls } from "@/components/Workout/WorkoutBottomControls"
import { WorkoutDayView } from "@/components/Workout/WorkoutDayView"
import { WorkoutHeader } from "@/components/Workout/WorkoutHeader"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { BaseLayout } from "@/layouts/BaseLayout"

export const WorkoutScreen: React.FC = () => {
  const { openedWorkout } = useOpenedWorkout()

  return (
    <BaseLayout>
      <WorkoutHeader />

      <WorkoutDayView workout={openedWorkout} />

      <WorkoutBottomControls />
    </BaseLayout>
  )
}
