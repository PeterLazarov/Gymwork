import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { Icon, IconButton, boxShadows, colors, fontSize } from 'designSystem'
import { navigate } from 'app/navigators'
import { WorkoutStep } from 'app/db/models'

type Props = {
  step: WorkoutStep
  onExerciseChange: (index: number) => void
}
const ExerciseControl: React.FC<Props> = ({ step, onExerciseChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const getPrev = () => {
    const newIndex =
      selectedIndex > 0 ? selectedIndex - 1 : step.exercises.length - 1
    setSelectedIndex(newIndex)
    onExerciseChange(newIndex)
  }

  const getNext = () => {
    const newIndex =
      selectedIndex === step.exercises.length - 1 ? 0 : selectedIndex + 1
    setSelectedIndex(newIndex)
    onExerciseChange(newIndex)
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.neutralLightest,
        padding: 4,
        ...boxShadows.default,
      }}
    >
      <IconButton onPress={getPrev}>
        <Icon icon="chevron-back" />
      </IconButton>
      <TouchableOpacity
        onPress={() => navigate('Calendar')}
        style={{ flex: 1 }}
      >
        <Text
          style={{ fontSize: fontSize.lg }}
          numberOfLines={1}
        >
          {step.exercises[selectedIndex].name}
        </Text>
      </TouchableOpacity>
      <IconButton onPress={getNext}>
        <Icon icon="chevron-forward" />
      </IconButton>
    </View>
  )
}

export default ExerciseControl
