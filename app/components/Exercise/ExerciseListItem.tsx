import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, Text, TouchableHighlight } from 'react-native'

import { Exercise } from 'app/db/models'
import {
  PressableHighlight,
  IconButton,
  Icon,
  colors,
  fontSize,
} from 'designSystem'

export type ExerciseListItemProps = {
  exercise: Exercise
  onSelect: (exercise: Exercise) => void
  isSelected: boolean
} & Partial<TouchableHighlight['props']>
const ExerciseListItem: React.FC<ExerciseListItemProps> = ({
  exercise,
  onSelect,
  isSelected,
  ...rest
}) => {
  const heartIcon = exercise.isFavorite ? 'heart' : 'heart-outlined'

  return (
    <PressableHighlight
      onPress={() => onSelect(exercise)}
      {...rest}
    >
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
