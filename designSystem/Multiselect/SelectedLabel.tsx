import React from 'react'
import { View } from 'react-native'

import { Text, useColors, Icon, IconButton } from 'designSystem'

type Props = {
  selection: string
  hideRemove?: boolean
  onRemove?: (option: string) => void
}

const SelectedLabel: React.FC<Props> = ({
  selection,
  hideRemove,
  onRemove,
}) => {
  const colors = useColors()

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.mat.primary,
        paddingLeft: 10,
        paddingRight: 4,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          color: colors.mat.primary,
          textTransform: 'capitalize',
        }}
      >
        {selection}
      </Text>
      {!hideRemove && (
        <IconButton
          onPress={() => onRemove?.(selection)}
          size="sm"
        >
          <Icon
            icon="close"
            size="small"
          />
        </IconButton>
      )}
    </View>
  )
}

export default SelectedLabel
