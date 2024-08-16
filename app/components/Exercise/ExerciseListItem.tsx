import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'
import { IconButton, List } from 'react-native-paper'

import { Exercise } from 'app/db/models'
import { BodyLargeLabel, Icon, colors, iconSizes } from 'designSystem'

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
          <BodyLargeLabel
            style={{ flex: 1 }}
            numberOfLines={1}
          >
            {exercise.name}
          </BodyLargeLabel>
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
