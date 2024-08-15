import { View } from 'react-native'

import WorkoutExerciseSetReadOnlyList from './WorkoutExercise/WorkoutExerciseSetReadOnlyList/WorkoutExerciseSetReadOnlyList'
import { Exercise, WorkoutSet } from 'app/db/models'
import { BodyLargeLabel } from 'designSystem'

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
      <BodyLargeLabel
        style={{ marginBottom: 8, textAlign: 'center' }}
        key={exercise.guid}
      >
        {exercise.name}
      </BodyLargeLabel>
      <WorkoutExerciseSetReadOnlyList
        exercise={exercise}
        sets={sets}
      />
    </View>
  )
}

export default CalendarWorkoutModalExerciseItem
