import { WorkoutBottomControls } from "@/components/Workout/WorkoutBottomControls"
import { WorkoutDayView } from "@/components/Workout/WorkoutDayView"
import { WorkoutHeader } from "@/components/Workout/WorkoutHeader"
import { BaseLayout } from "@/layouts/BaseLayout"

export const WorkoutScreen: React.FC = () => {
  return (
    <BaseLayout>
      <WorkoutHeader />

      <WorkoutDayView />

      <WorkoutBottomControls />
    </BaseLayout>
  )
}
