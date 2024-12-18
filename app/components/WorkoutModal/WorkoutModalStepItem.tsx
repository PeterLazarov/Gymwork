import { View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { WorkoutStep } from 'app/db/models'
import { spacing, Text } from 'designSystem'

import StepSetsList from '../WorkoutStep/StepSetsList/StepSetsList'

type Props = {
  step: WorkoutStep
}
const CalendarWorkoutModalStepItem: React.FC<Props> = ({ step }) => {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <>
      {step.exercises.map(exercise => (
        <View
          key={exercise.guid}
          style={{ padding: spacing.xs }}
        >
          <Text
            style={{
              color: colors.onSurface,
              marginBottom: spacing.xs,
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
