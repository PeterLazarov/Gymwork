import React from 'react'
import { View, Text } from 'react-native'

import { colors, fontSize, Icon, IconButton } from 'designSystem'

type Props = {
  selection: string
  hideRemove?: boolean
  onRemove?: (option: string) => void
}

const SelectedLabel: React.FC<Props> = ({
  selection,
  hideRemove,
  onRemove,
}) => (
  <View
    style={{
      borderWidth: 1,
      borderColor: colors.primary,
      paddingHorizontal: 15,
      paddingVertical: 6,
      borderRadius: 8,
      gap: 8,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text
      style={{
        fontSize: fontSize.sm,
        color: colors.primary,
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

export default SelectedLabel
