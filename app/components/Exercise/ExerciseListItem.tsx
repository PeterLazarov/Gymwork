import { observer } from 'mobx-react-lite'
import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'

import { useStores } from 'app/db/helpers/useStores'
import { exerciseImages } from 'app/utils/exerciseImages'
import { Exercise } from 'app/db/models'
import {
  fontSize,
  Icon,
  IconButton,
  palettes,
  spacing,
  Text,
  useColors,
} from 'designSystem'

export type ExerciseListItemProps = {
  exercise: Exercise
  onSelect: (exercise: Exercise) => void
  isSelected: boolean
  height: number
}

const ExerciseListItem: React.FC<ExerciseListItemProps> = ({
  exercise,
  onSelect,
  isSelected,
  height,
}) => {
  const heartIcon = exercise.isFavorite ? 'heart' : 'heart-outlined'
  const colors = useColors()
  const {
    navStore: { navigate },
  } = useStores()

  function handleLongPress() {
    navigate('ExerciseDetails', { exerciseId: exercise.guid })
  }

  const imageUri = exercise.images?.[0]

  return (
    <TouchableOpacity
      onPress={() => onSelect(exercise)}
      onLongPress={handleLongPress}
    >
      <View
        style={{
          width: '100%',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: spacing.xxs,
          gap: spacing.xxs,
          height,
          backgroundColor: isSelected ? colors.secondary : 'transparent',
        }}
      >
        <Image
          width={height}
          height={height}
          style={{ height, width: height }}
          source={imageUri ? exerciseImages[imageUri] : undefined}
        />

        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              flexWrap: 'wrap',
              color: isSelected ? colors.onSecondary : colors.onSurface,
            }}
            numberOfLines={1}
          >
            {exercise.name}
          </Text>
          <Text
            style={{
              // flex: 1,
              flexWrap: 'wrap',
              fontSize: fontSize.xs,
              color: colors.onSurfaceVariant,
            }}
            numberOfLines={1}
          >
            {exercise.muscleAreas.join(', ')}
          </Text>
        </View>

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
