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
        fontSize: fontSize.sm,
        color: colors.primary,
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

export default SelectedLabel
