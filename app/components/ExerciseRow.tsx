import React, { useMemo } from 'react'
import { Text, View } from 'react-native'

import {
  Icon,
  IconButton,
  PressableHighlight,
  boxShadows,
  colors,
  fontSize,
} from 'designSystem'
import { Exercise } from 'app/db/models'

export type ExerciseRowProps = {
  options?: Exercise[]
  selected?: Exercise | undefined
  onPress?(): void
  onPrevPress?(): void
  onNextPress?(): void
}

const ExerciseRow: React.FC<ExerciseRowProps> = ({
  options,
  selected,
  onNextPress,
  onPress,
  onPrevPress,
}) => {
  const renderBack = useMemo(
    () => !!options?.length && !!onPrevPress,
    [options?.length, onPrevPress]
  )
  const renderForward = useMemo(
    () => !!options?.length && !!onNextPress,
    [options?.length, onNextPress]
  )

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.neutralLightest,
        minHeight: 44,
        gap: 4,
        ...boxShadows.default,
      }}
    >
      {renderBack && (
        <IconButton onPress={onPrevPress}>
          <Icon icon="chevron-back" />
        </IconButton>
      )}

      <PressableHighlight
        onPress={onPress}
        style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: fontSize.lg,
            color: selected ? colors.neutralDarkest : colors.neutralDarker,
          }}
          numberOfLines={1}
        >
          {selected ? selected.name : 'Press to select exercise'}
        </Text>
      </PressableHighlight>

      {renderForward && (
        <IconButton onPress={onNextPress}>
          <Icon icon="chevron-forward" />
        </IconButton>
      )}
    </View>
  )
}

export default ExerciseRow
