import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, Text } from 'react-native'
import { IconButton, List } from 'react-native-paper'

import { Exercise } from 'app/db/models'
import { Icon, colors, fontSize, iconSizes } from 'designSystem'

type Props = {
  exercise: Exercise
  onSelect: (exercise: Exercise) => void
}
const ExerciseListItem: React.FC<Props> = ({ exercise, onSelect }) => {
  const heartIcon = exercise.isFavorite ? 'heart' : 'heart-outlined'

  return (
    <List.Item
      title={
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{ fontSize: fontSize.md, flex: 1 }}
            numberOfLines={1}
          >
            {exercise.name}
          </Text>
          <IconButton
            size={iconSizes.small}
            icon={() => (
              <Icon
                icon={heartIcon}
                color={colors.primary}
              />
            )}
            onPress={e => {
              e.stopPropagation()
              exercise.setProp('isFavorite', !exercise.isFavorite)
            }}
          />
        </View>
      }
      onPress={() => onSelect(exercise)}
    />
  )
}

export default observer(ExerciseListItem)
