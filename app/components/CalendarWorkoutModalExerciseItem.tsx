import { View, Text } from 'react-native'

import WorkoutExerciseSetReadOnlyList from './WorkoutStep/StepSetsList/StepSetsList'
import { Exercise, WorkoutStep } from 'app/db/models'
import { fontSize } from 'designSystem'

type Props = {
  exercise: Exercise
  step: WorkoutStep
}
const CalendarWorkoutModalExerciseItem: React.FC<Props> = ({
  exercise,
  step,
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
      <WorkoutExerciseSetReadOnlyList step={step} />
    </View>
  )
}

export default CalendarWorkoutModalExerciseItem
