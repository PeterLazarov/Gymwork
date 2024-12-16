import React from 'react'
import { View, StyleSheet } from 'react-native'

import { WorkoutStep } from 'app/db/models'
import { Text, Icon, IconButton } from 'designSystem'

type Props = {
  step: WorkoutStep
  onStepRemove: (step: WorkoutStep) => void
}

const TemplateStepsListItem: React.FC<Props> = ({ step, onStepRemove }) => {
  const isSuperset = step.type === 'superSet'
  return (
    <View
      key={step.guid}
      style={styles.item}
    >
      <View style={styles.nameContainer}>
        {step.exercises.map(exercise => (
          <Text key={exercise.guid}>
            {isSuperset && `${step.exerciseLettering[exercise.guid]}: `}
            {exercise.name}
          </Text>
        ))}
      </View>
      <IconButton onPress={() => onStepRemove(step)}>
        <Icon icon="delete" />
      </IconButton>
    </View>
  )
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center' },
  nameContainer: {
    flex: 1,
  },
})

export default TemplateStepsListItem
