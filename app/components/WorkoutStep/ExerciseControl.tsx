import React from 'react'
import { View } from 'react-native'

import {
  Text,
  Icon,
  IconButton,
  boxShadows,
  useColors,
  fontSize,
} from 'designSystem'
import { Exercise } from 'app/db/models'

export type ExerciseControlProps = {
  options: Exercise[]
  selectedIndex: number
  onChange: (exercise: Exercise) => void
}

const ExerciseControl: React.FC<ExerciseControlProps> = ({
  options,
  selectedIndex,
  onChange,
}) => {
  const colors = useColors()

  const exercise = options[selectedIndex]!
  const atStart = selectedIndex === 0
  const atEnd = selectedIndex === options.length - 1

  const getPrev = () => {
    onChange(atStart ? options.at(-1)! : options[selectedIndex - 1]!)
  }

  const getNext = () => {
    onChange(atEnd ? options[0]! : options[selectedIndex + 1]!)
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.mat.surfaceContainerLowest,
        padding: 4,
        ...boxShadows.default,
      }}
    >
      <IconButton onPress={getPrev}>
        <Icon icon="chevron-back" />
      </IconButton>

      <Text
        style={{ fontSize: fontSize.lg, flex: 1 }}
        numberOfLines={1}
      >
        {exercise.name}
      </Text>

      <IconButton onPress={getNext}>
        <Icon icon="chevron-forward" />
      </IconButton>
    </View>
  )
}

export default ExerciseControl
