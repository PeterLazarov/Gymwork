import { View, Text } from 'react-native'

import StepSetsList from './WorkoutStep/StepSetsList/StepSetsList'
import { WorkoutStep } from 'app/db/models'
import { fontSize, useColors } from 'designSystem'

type Props = {
  step: WorkoutStep
}
const CalendarWorkoutModalStepItem: React.FC<Props> = ({ step }) => {
  const colors = useColors()

  return (
    <>
      {step.exercises.map(exercise => (
        <View
          key={exercise.guid}
          style={{ padding: 8 }}
        >
          <Text
            style={{
              fontSize: fontSize.md,
              color: colors.tertiaryText,
              marginBottom: 8,
              textAlign: 'center',
            }}
            key={exercise.guid}
          >
            {exercise.name}
          </Text>
          <StepSetsList
            step={step}
            sets={step.exerciseSetsMap[exercise.guid] || []}
            hideSupersetLetters
          />
        </View>
      ))}
    </>
  )
}

export default CalendarWorkoutModalStepItem
