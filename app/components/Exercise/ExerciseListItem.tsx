import { observer } from 'mobx-react-lite'
import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { Exercise } from 'app/db/models'
import { Icon, IconButton, palettes, spacing, Text } from 'designSystem'
import { exerciseImages } from '@/utils/exerciseImages'

type Props = {
  exercise: Exercise
  onSelect: (exercise: Exercise) => void
  isSelected: boolean
  height: number
}

const ExerciseListItem: React.FC<Props> = ({
  exercise,
  onSelect,
  isSelected,
  height,
}) => {
  const heartIcon = exercise.isFavorite ? 'heart' : 'heart-outlined'
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <TouchableOpacity onPress={() => onSelect(exercise)}>
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
          style={{ height, width: height }}
          source={exerciseImages[exercise.images[0]]}
        />
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
