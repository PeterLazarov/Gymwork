import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'

import { colors, Icon, fontSize } from '..'

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
      paddingVertical: 8,
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
      <TouchableOpacity onPress={() => onRemove?.(selection)}>
        <Icon
          icon="close"
          size="small"
        />
      </TouchableOpacity>
    )}
  </View>
)

export default SelectedLabel
