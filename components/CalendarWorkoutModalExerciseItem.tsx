import { View } from 'react-native'

import WorkoutExerciseSetReadOnlyList from './WorkoutExercise/WorkoutExerciseSetReadOnlyList'
import { Exercise, WorkoutSet } from '../db/models'
import { SectionLabel } from '../designSystem/Label'

type Props = {
  exercise: Exercise
  sets: WorkoutSet[]
}
const CalendarWorkoutModalExerciseItem: React.FC<Props> = ({
  exercise,
  sets,
}) => {
  return (
    <View style={{ padding: 8 }}>
      <SectionLabel
        style={{ marginBottom: 8 }}
        key={exercise.guid}
      >
        {exercise.name}
      </SectionLabel>
      <WorkoutExerciseSetReadOnlyList
        exercise={exercise}
        sets={sets}
      />
    </View>
  )
}

export default CalendarWorkoutModalExerciseItem
