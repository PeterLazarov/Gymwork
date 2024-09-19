import { observer } from 'mobx-react-lite'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { Exercise } from 'app/db/models'
import { Text, IconButton, Icon, useColors, palettes } from 'designSystem'

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
  const colors = useColors()

  return (
    <TouchableOpacity onPress={() => onSelect(exercise)}>
      <View
        style={{
          width: '100%',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
          backgroundColor: isSelected ? colors.secondary : 'transparent',
        }}
      >
        <Text
          style={{
            flex: 1,
            flexWrap: 'wrap',
            color: isSelected ? colors.onSecondary : colors.onSurface,
          }}
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
            color={palettes.error['60']}
          />
        </IconButton>
      </View>
    </TouchableOpacity>
  )
}

export default observer(ExerciseListItem)
