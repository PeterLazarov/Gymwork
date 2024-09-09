import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, Text } from 'react-native'

import { Exercise } from 'app/db/models'
import {
  PressableHighlight,
  IconButton,
  Icon,
  colors,
  fontSize,
} from 'designSystem'

type Props = {
  exercise: Exercise
  onSelect: (exercise: Exercise) => void
  isSelected: boolean
}
const ExerciseListItem: React.FC<Props> = ({
  exercise,
  onSelect,
  isSelected,
}) => {
  const heartIcon = exercise.isFavorite ? 'heart' : 'heart-outlined'

  return (
    <PressableHighlight onPress={() => onSelect(exercise)}>
      <View
        style={{
          width: '100%',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
          backgroundColor: isSelected ? colors.neutral : colors.neutralLight,
        }}
      >
        <Text
          style={{ fontSize: fontSize.md, flex: 1, flexWrap: 'wrap' }}
          numberOfLines={1}
        >
          {exercise.name}
        </Text>
        <IconButton
          onPress={() => {
            exercise.setProp('isFavorite', !exercise.isFavorite)
          }}
        >
          <Icon
            icon={heartIcon}
            color={colors.accent}
          />
        </IconButton>
      </View>
    </PressableHighlight>
  )
}

export default observer(ExerciseListItem)
