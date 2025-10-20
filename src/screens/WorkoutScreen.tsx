import { WorkoutDayView } from "@/components/Workout/WorkoutDayView"
import { WorkoutHeader } from "@/components/Workout/WorkoutHeader"
import { BaseLayout } from "@/layouts/BaseLayout"

export const WorkoutScreen: React.FC = () => {
  const date = ""
  return (
    <BaseLayout>
      <WorkoutHeader date={date} />

      <WorkoutDayView date={date} />
    </BaseLayout>
  )
}
