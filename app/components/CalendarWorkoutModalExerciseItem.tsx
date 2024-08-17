import { View, Text } from 'react-native'

import WorkoutExerciseSetReadOnlyList from './WorkoutExercise/WorkoutExerciseSetList/WorkoutExerciseSetList'
import { Exercise, WorkoutSet } from 'app/db/models'
import { fontSize } from 'designSystem'

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
      <Text
        style={{
          fontSize: fontSize.md,
          marginBottom: 8,
          textAlign: 'center',
        }}
        key={exercise.guid}
      >
        {exercise.name}
      </Text>
      <WorkoutExerciseSetReadOnlyList
        exercise={exercise}
        sets={sets}
      />
    </View>
  )
}

export default CalendarWorkoutModalExerciseItem
